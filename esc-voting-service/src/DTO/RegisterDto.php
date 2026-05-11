<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Email]
        public readonly ?string $email = null,

        #[Assert\NotBlank]
        #[Assert\Length(min: 6)]
        public readonly ?string $password = null,

        #[Assert\NotBlank]
        #[Assert\Length(max: 30)]
        public readonly ?string $firstName = null,

        #[Assert\NotBlank]
        #[Assert\Length(max: 30)]
        public readonly ?string $lastName = null,
    ) {}
}
