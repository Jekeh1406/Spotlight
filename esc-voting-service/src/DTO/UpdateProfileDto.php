<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class UpdateProfileDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Email]
        public readonly ?string $email = null,

        #[Assert\NotBlank]
        #[Assert\Length(max: 30)]
        public readonly ?string $firstName = null,

        #[Assert\NotBlank]
        #[Assert\Length(max: 30)]
        public readonly ?string $lastName = null,
    ) {}
}
