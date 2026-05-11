<?php

namespace App\DTO;

use App\Entity\Song;
use App\Entity\User;

class SongDto
{
    public function __construct(
        public int $id,
        public string $title,
        public string $artist,
        public CountryDto $country,
        public ?int $order = null,
        public ?string $imageUrl = null,
        public ?VoteDto $userVote = null,
    ) {}

    public static function fromEntity(Song $song, ?User $currentUser = null): self
    {
        $userVote = null;
        if ($currentUser) {
            foreach ($song->getVotes() as $vote) {
                if ($vote->getUser() === $currentUser) {
                    $userVote = VoteDto::fromEntity($vote);
                    break;
                }
            }
        }

        return new self(
            $song->getId(),
            $song->getTitle(),
            $song->getArtist(),
            CountryDto::fromEntity($song->getCountry()),
            $song->getOrder(),
            $song->getImageUrl(),
            $userVote,
        );
    }
}
