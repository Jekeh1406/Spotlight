<?php

namespace App\Controller;

use App\DTO\SongDto;
use App\Repository\SongRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Song;
use App\Entity\Country;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

final class SongController extends AbstractController
{
    #[Route('/song', name: 'app_song')]
    public function index(): Response
    {
        return $this->render('song/index.html.twig', [
            'controller_name' => 'SongController',
        ]);
    }

    #[Route('/api/songs', name: 'list_songs', methods: ['GET'])]
    public function list(SongRepository $songRepository): JsonResponse
    {
        $songs = $songRepository->findAll();
        $user = $this->getUser();

        return new JsonResponse(
            array_map(fn(Song $song) => SongDto::fromEntity($song, $user), $songs),
        );
    }
}
