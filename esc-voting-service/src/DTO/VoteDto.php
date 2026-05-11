<?php

namespace App\DTO;

use App\Entity\Vote;

class VoteDto
{
    public function __construct(
        public int $id,
        public int $userId,
        public int $songId,
        public float $noteVoix,
        public float $noteMusique,
        public float $noteInterpretation,
        public float $noteMiseEnScene,
    ) {}

    public static function fromEntity(Vote $vote): self
    {
        return new self(
            $vote->getId(),
            $vote->getUser()->getId(),
            $vote->getSong()->getId(),
            $vote->getNoteVoix(),
            $vote->getNoteMusique(),
            $vote->getNoteInterpretation(),
            $vote->getNoteMiseEnScene()
        );
    }
}
