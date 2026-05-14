<?php

namespace App\Controller;

use App\DTO\VoteGroupDto;
use App\Entity\VoteGroup;
use App\Repository\SongRepository;
use App\Repository\UserRepository;
use App\Repository\VoteGroupRepository;
use App\Repository\VoteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/groups')]
final class VoteGroupController extends AbstractController
{
    #[Route('', name: 'list_groups', methods: ['GET'])]
    public function list(VoteGroupRepository $groupRepository): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $groups = $user->getVoteGroups();

        return new JsonResponse(
            array_map(fn(VoteGroup $group) => VoteGroupDto::fromEntity($group), $groups->toArray())
        );
    }

    #[Route('/{id}', name: 'get_group', methods: ['GET'])]
    public function get(int $id, VoteGroupRepository $groupRepository): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $group = $groupRepository->find($id);
        if (!$group) {
            return new JsonResponse(['error' => 'Group not found'], Response::HTTP_NOT_FOUND);
        }

        if (!$group->getMembers()->contains($user)) {
            return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        return new JsonResponse(VoteGroupDto::fromEntity($group));
    }

    #[Route('', name: 'create_group', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['name'])) {
            return new JsonResponse(['error' => 'Name is required'], Response::HTTP_BAD_REQUEST);
        }

        $group = new VoteGroup();
        $group->setName($data['name']);
        $group->setCode($this->generateCode());
        $group->setOwner($user);
        $group->addMember($user);

        $em->persist($group);
        $em->flush();

        return new JsonResponse(VoteGroupDto::fromEntity($group), Response::HTTP_CREATED);
    }

    #[Route('/join', name: 'join_group', methods: ['POST'])]
    public function join(Request $request, VoteGroupRepository $groupRepository, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['code'])) {
            return new JsonResponse(['error' => 'Code is required'], Response::HTTP_BAD_REQUEST);
        }

        $group = $groupRepository->findByCode($data['code']);
        if (!$group) {
            return new JsonResponse(['error' => 'Group not found'], Response::HTTP_NOT_FOUND);
        }

        if ($group->getMembers()->contains($user)) {
            return new JsonResponse(['error' => 'Already a member'], Response::HTTP_CONFLICT);
        }

        $group->addMember($user);
        $em->flush();

        return new JsonResponse(VoteGroupDto::fromEntity($group));
    }

    #[Route('/{id}', name: 'update_group', methods: ['PATCH'])]
    public function update(int $id, Request $request, VoteGroupRepository $groupRepository, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $group = $groupRepository->find($id);
        if (!$group) {
            return new JsonResponse(['error' => 'Group not found'], Response::HTTP_NOT_FOUND);
        }

        if ($group->getOwner() !== $user) {
            return new JsonResponse(['error' => 'Only the group owner can rename the group'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['name']) || !trim($data['name'])) {
            return new JsonResponse(['error' => 'Name is required'], Response::HTTP_BAD_REQUEST);
        }

        $group->setName(trim($data['name']));
        $em->flush();

        return new JsonResponse(VoteGroupDto::fromEntity($group));
    }

    #[Route('/{id}/leave', name: 'leave_group', methods: ['POST'])]
    public function leave(int $id, VoteGroupRepository $groupRepository, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $group = $groupRepository->find($id);
        if (!$group) {
            return new JsonResponse(['error' => 'Group not found'], Response::HTTP_NOT_FOUND);
        }

        if (!$group->getMembers()->contains($user)) {
            return new JsonResponse(['error' => 'Not a member'], Response::HTTP_BAD_REQUEST);
        }

        if ($group->getOwner() === $user) {
            // Si le owner est le seul membre, supprimer le groupe
            if ($group->getMembers()->count() === 1) {
                $em->remove($group);
                $em->flush();
                return new JsonResponse(null, Response::HTTP_NO_CONTENT);
            }
            return new JsonResponse(['error' => 'Owner cannot leave the group. Transfer ownership first or remove all members.'], Response::HTTP_FORBIDDEN);
        }

        $group->removeMember($user);
        $em->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/{id}/members/{userId}', name: 'kick_member', methods: ['DELETE'])]
    public function kickMember(int $id, int $userId, VoteGroupRepository $groupRepository, UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $group = $groupRepository->find($id);
        if (!$group) {
            return new JsonResponse(['error' => 'Group not found'], Response::HTTP_NOT_FOUND);
        }

        if ($group->getOwner() !== $user) {
            return new JsonResponse(['error' => 'Only the group owner can kick members'], Response::HTTP_FORBIDDEN);
        }

        $memberToKick = $userRepository->find($userId);
        if (!$memberToKick) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        if (!$group->getMembers()->contains($memberToKick)) {
            return new JsonResponse(['error' => 'User is not a member of this group'], Response::HTTP_BAD_REQUEST);
        }

        if ($memberToKick === $user) {
            return new JsonResponse(['error' => 'Owner cannot kick themselves'], Response::HTTP_BAD_REQUEST);
        }

        $group->removeMember($memberToKick);
        $em->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/{id}/ranking', name: 'group_ranking', methods: ['GET'])]
    public function ranking(int $id, VoteGroupRepository $groupRepository, VoteRepository $voteRepository, SongRepository $songRepository): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $group = $groupRepository->find($id);
        if (!$group) {
            return new JsonResponse(['error' => 'Group not found'], Response::HTTP_NOT_FOUND);
        }

        if (!$group->getMembers()->contains($user)) {
            return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        $members = $group->getMembers()->toArray();
        $memberIds = array_map(fn($m) => $m->getId(), $members);

        $songs = $songRepository->findAll();
        $ranking = [];

        foreach ($songs as $song) {
            $votes = $voteRepository->findBy(['song' => $song]);
            $groupVotes = array_filter($votes, fn($v) => in_array($v->getUser()->getId(), $memberIds));

            if (count($groupVotes) === 0) {
                continue;
            }

            $totalScore = 0;
            $voteCount = count($groupVotes);

            foreach ($groupVotes as $vote) {
                $totalScore += $vote->getNoteVoix() + $vote->getNoteMusique() + $vote->getNoteInterpretation() + $vote->getNoteMiseEnScene();
            }

            $ranking[] = [
                'songId' => $song->getId(),
                'title' => $song->getTitle(),
                'artist' => $song->getArtist(),
                'country' => $song->getCountry()->getName(),
                'imageUrl' => $song->getImageUrl(),
                'score' => round($totalScore / $voteCount, 2),
                'voteCount' => $voteCount,
            ];
        }

        usort($ranking, fn($a, $b) => $b['score'] <=> $a['score']);

        $currentRank = 1;
        $previousScore = null;
        foreach ($ranking as $index => &$item) {
            if ($previousScore !== null && $item['score'] < $previousScore) {
                $currentRank = $index + 1;
            }
            $item['rank'] = $currentRank;
            $previousScore = $item['score'];
        }

        return new JsonResponse($ranking);
    }

    #[Route('/{id}/songs/{songId}/votes', name: 'group_song_votes', methods: ['GET'])]
    public function songVotes(int $id, int $songId, VoteGroupRepository $groupRepository, VoteRepository $voteRepository, SongRepository $songRepository): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $group = $groupRepository->find($id);
        if (!$group) {
            return new JsonResponse(['error' => 'Group not found'], Response::HTTP_NOT_FOUND);
        }

        if (!$group->getMembers()->contains($user)) {
            return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        $song = $songRepository->find($songId);
        if (!$song) {
            return new JsonResponse(['error' => 'Song not found'], Response::HTTP_NOT_FOUND);
        }

        $members = $group->getMembers()->toArray();
        $memberIds = array_map(fn($m) => $m->getId(), $members);

        $votes = $voteRepository->findBy(['song' => $song]);
        $groupVotes = array_filter($votes, fn($v) => in_array($v->getUser()->getId(), $memberIds));

        $result = [];
        foreach ($groupVotes as $vote) {
            $voteUser = $vote->getUser();
            $score = $vote->getNoteVoix() + $vote->getNoteMusique() + $vote->getNoteInterpretation() + $vote->getNoteMiseEnScene();

            $result[] = [
                'voteId' => $vote->getId(),
                'userId' => $voteUser->getId(),
                'firstName' => $voteUser->getFirstName(),
                'lastName' => $voteUser->getLastName(),
                'noteVoix' => $vote->getNoteVoix(),
                'noteMusique' => $vote->getNoteMusique(),
                'noteInterpretation' => $vote->getNoteInterpretation(),
                'noteMiseEnScene' => $vote->getNoteMiseEnScene(),
                'score' => $score,
            ];
        }

        return new JsonResponse([
            'song' => [
                'id' => $song->getId(),
                'title' => $song->getTitle(),
                'artist' => $song->getArtist(),
                'country' => $song->getCountry()->getName(),
                'imageUrl' => $song->getImageUrl(),
            ],
            'votes' => $result,
            'voteCount' => count($result),
        ]);
    }

    #[Route('/{id}/stats', name: 'group_stats', methods: ['GET'])]
    public function stats(int $id, VoteGroupRepository $groupRepository, VoteRepository $voteRepository): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $group = $groupRepository->find($id);
        if (!$group) {
            return new JsonResponse(['error' => 'Group not found'], Response::HTTP_NOT_FOUND);
        }

        if (!$group->getMembers()->contains($user)) {
            return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        $members = $group->getMembers()->toArray();
        $memberStats = [];

        foreach ($members as $member) {
            $votes = $voteRepository->findBy(['user' => $member]);

            if (count($votes) === 0) {
                continue;
            }

            $totalScore = 0;
            $highestVote = 0;
            $lowestVote = 20;
            $voteCount = count($votes);

            foreach ($votes as $vote) {
                $score = $vote->getNoteVoix() + $vote->getNoteMusique() + $vote->getNoteInterpretation() + $vote->getNoteMiseEnScene();
                $totalScore += $score;
                $highestVote = max($highestVote, $score);
                $lowestVote = min($lowestVote, $score);
            }

            $memberStats[] = [
                'userId' => $member->getId(),
                'firstName' => $member->getFirstName(),
                'lastName' => $member->getLastName(),
                'averageGiven' => round($totalScore / $voteCount, 2),
                'highestVote' => $highestVote,
                'lowestVote' => $lowestVote,
                'voteCount' => $voteCount,
            ];
        }

        $nicest = null;
        $meanest = null;
        $mostGenerous = null;
        $mostCritical = null;

        if (count($memberStats) >= 2) {
            usort($memberStats, fn($a, $b) => $b['averageGiven'] <=> $a['averageGiven']);
            $nicest = [
                'userId' => $memberStats[0]['userId'],
                'name' => $memberStats[0]['firstName'] . ' ' . $memberStats[0]['lastName'],
                'averageGiven' => $memberStats[0]['averageGiven'],
            ];
            $meanest = [
                'userId' => $memberStats[count($memberStats) - 1]['userId'],
                'name' => $memberStats[count($memberStats) - 1]['firstName'] . ' ' . $memberStats[count($memberStats) - 1]['lastName'],
                'averageGiven' => $memberStats[count($memberStats) - 1]['averageGiven'],
            ];

            usort($memberStats, fn($a, $b) => $b['highestVote'] <=> $a['highestVote']);
            $mostGenerous = [
                'userId' => $memberStats[0]['userId'],
                'name' => $memberStats[0]['firstName'] . ' ' . $memberStats[0]['lastName'],
                'highestVote' => $memberStats[0]['highestVote'],
            ];

            usort($memberStats, fn($a, $b) => $a['lowestVote'] <=> $b['lowestVote']);
            $mostCritical = [
                'userId' => $memberStats[0]['userId'],
                'name' => $memberStats[0]['firstName'] . ' ' . $memberStats[0]['lastName'],
                'lowestVote' => $memberStats[0]['lowestVote'],
            ];
        }

        return new JsonResponse([
            'nicest' => $nicest,
            'meanest' => $meanest,
            'mostGenerous' => $mostGenerous,
            'mostCritical' => $mostCritical,
            'members' => $memberStats,
        ]);
    }

    private function generateCode(): string
    {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $code = '';
        for ($i = 0; $i < 6; $i++) {
            $code .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $code;
    }
}
