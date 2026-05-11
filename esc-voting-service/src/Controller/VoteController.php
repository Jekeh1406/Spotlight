<?php

namespace App\Controller;

use App\DTO\CreateVoteDto;
use App\DTO\VoteDto;
use App\Entity\Vote;
use App\Repository\SongRepository;
use App\Repository\VoteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/votes')]
final class VoteController extends AbstractController
{
    #[Route('', name: 'list_votes', methods: ['GET'])]
    public function list(VoteRepository $voteRepository): JsonResponse
    {
        $votes = $voteRepository->findAll();

        return new JsonResponse(
            array_map(fn(Vote $vote) => VoteDto::fromEntity($vote), $votes)
        );
    }

    #[Route('/my-votes', name: 'my_votes', methods: ['GET'])]
    public function myVotes(VoteRepository $voteRepository): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $votes = $voteRepository->findBy(['user' => $user]);

        // Calculer le score total pour chaque vote et préparer les données
        $votesWithScore = array_map(function (Vote $vote) {
            $score = $vote->getNoteVoix() + $vote->getNoteMusique() + $vote->getNoteInterpretation() + $vote->getNoteMiseEnScene();
            return [
                'vote' => $vote,
                'score' => $score,
            ];
        }, $votes);

        // Trier par score décroissant
        usort($votesWithScore, fn($a, $b) => $b['score'] <=> $a['score']);

        // Attribuer les rangs avec gestion des égalités
        $result = [];
        $currentRank = 1;
        $previousScore = null;
        foreach ($votesWithScore as $index => $item) {
            if ($previousScore !== null && $item['score'] < $previousScore) {
                $currentRank = $index + 1;
            }
            $voteData = VoteDto::fromEntity($item['vote']);
            $result[] = [
                'id' => $voteData->id,
                'userId' => $voteData->userId,
                'songId' => $voteData->songId,
                'noteVoix' => $voteData->noteVoix,
                'noteMusique' => $voteData->noteMusique,
                'noteInterpretation' => $voteData->noteInterpretation,
                'noteMiseEnScene' => $voteData->noteMiseEnScene,
                'score' => $item['score'],
                'rank' => $currentRank,
            ];
            $previousScore = $item['score'];
        }

        return new JsonResponse($result);
    }

    #[Route('/song/{songId}', name: 'votes_by_song', methods: ['GET'])]
    public function bySong(int $songId, VoteRepository $voteRepository, SongRepository $songRepository): JsonResponse
    {
        $song = $songRepository->find($songId);
        if (!$song) {
            return new JsonResponse(['error' => 'Song not found'], Response::HTTP_NOT_FOUND);
        }

        $votes = $voteRepository->findBy(['song' => $song]);

        return new JsonResponse(
            array_map(fn(Vote $vote) => VoteDto::fromEntity($vote), $votes)
        );
    }

    #[Route('/{id}', name: 'get_vote', methods: ['GET'])]
    public function get(int $id, VoteRepository $voteRepository): JsonResponse
    {
        $vote = $voteRepository->find($id);

        if (!$vote) {
            return new JsonResponse(['error' => 'Vote not found'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse(VoteDto::fromEntity($vote));
    }

    #[Route('', name: 'create_vote', methods: ['POST'])]
    public function create(
        Request $request,
        ValidatorInterface $validator,
        EntityManagerInterface $em,
        SongRepository $songRepository,
        VoteRepository $voteRepository,
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        $dto = new CreateVoteDto(
            songId: $data['songId'] ?? null,
            noteVoix: $data['noteVoix'] ?? null,
            noteMusique: $data['noteMusique'] ?? null,
            noteInterpretation: $data['noteInterpretation'] ?? null,
            noteMiseEnScene: $data['noteMiseEnScene'] ?? null,
        );

        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $messages], Response::HTTP_BAD_REQUEST);
        }

        $song = $songRepository->find($dto->songId);
        if (!$song) {
            return new JsonResponse(['error' => 'Song not found'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier si l'utilisateur a déjà voté pour cette chanson
        $existingVote = $voteRepository->findOneBy(['user' => $user, 'song' => $song]);
        if ($existingVote) {
            return new JsonResponse(['error' => 'You have already voted for this song'], Response::HTTP_CONFLICT);
        }

        $vote = new Vote();
        $vote->setUser($user);
        $vote->setSong($song);
        $vote->setNoteVoix($dto->noteVoix);
        $vote->setNoteMusique($dto->noteMusique);
        $vote->setNoteInterpretation($dto->noteInterpretation);
        $vote->setNoteMiseEnScene($dto->noteMiseEnScene);

        $em->persist($vote);
        $em->flush();

        return new JsonResponse(VoteDto::fromEntity($vote), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update_vote', methods: ['PUT', 'PATCH'])]
    public function update(
        int $id,
        Request $request,
        ValidatorInterface $validator,
        EntityManagerInterface $em,
        VoteRepository $voteRepository,
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $vote = $voteRepository->find($id);
        if (!$vote) {
            return new JsonResponse(['error' => 'Vote not found'], Response::HTTP_NOT_FOUND);
        }

        if ($vote->getUser() !== $user) {
            return new JsonResponse(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);

        $noteFields = ['noteVoix', 'noteMusique', 'noteInterpretation', 'noteMiseEnScene'];
        foreach ($noteFields as $field) {
            if (isset($data[$field]) && ($data[$field] < 0 || $data[$field] > 5)) {
                return new JsonResponse(['error' => "$field must be between 0 and 5"], Response::HTTP_BAD_REQUEST);
            }
        }

        if (isset($data['noteVoix'])) {
            $vote->setNoteVoix($data['noteVoix']);
        }
        if (isset($data['noteMusique'])) {
            $vote->setNoteMusique($data['noteMusique']);
        }
        if (isset($data['noteInterpretation'])) {
            $vote->setNoteInterpretation($data['noteInterpretation']);
        }
        if (isset($data['noteMiseEnScene'])) {
            $vote->setNoteMiseEnScene($data['noteMiseEnScene']);
        }

        $em->flush();

        return new JsonResponse(VoteDto::fromEntity($vote));
    }
}
