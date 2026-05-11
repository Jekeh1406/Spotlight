<?php

namespace App\DTO;

namespace App\DTO;

use App\Entity\User;

class UserDto
{
    public function __construct(
        public int $id,
        public string $email,
        public array $roles,
        public string $firstName,
        public string $lastName
    ) {}

    public static function fromEntity(User $user): self
    {
        return new self(
            $user->getId(),
            $user->getEmail(),
            $user->getRoles(),
            $user->getFirstName(),
            $user->getLastName()
        );
    }
}
