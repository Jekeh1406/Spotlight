<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class CreateVoteDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Positive]
        public readonly ?int $songId = null,

        #[Assert\NotBlank]
        #[Assert\Range(min: 0, max: 5)]
        public readonly ?float $noteVoix = null,

        #[Assert\NotBlank]
        #[Assert\Range(min: 0, max: 5)]
        public readonly ?float $noteMusique = null,

        #[Assert\NotBlank]
        #[Assert\Range(min: 0, max: 5)]
        public readonly ?float $noteInterpretation = null,

        #[Assert\NotBlank]
        #[Assert\Range(min: 0, max: 5)]
        public readonly ?float $noteMiseEnScene = null,
    ) {}
}
