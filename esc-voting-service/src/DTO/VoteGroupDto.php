<?php

namespace App\DTO;

use App\Entity\VoteGroup;

class VoteGroupDto
{
    public function __construct(
        public int $id,
        public string $name,
        public string $code,
        public int $ownerId,
        public array $members = [],
        public string $createdAt = '',
    ) {}

    public static function fromEntity(VoteGroup $group): self
    {
        return new self(
            $group->getId(),
            $group->getName(),
            $group->getCode(),
            $group->getOwner()->getId(),
            array_map(fn($user) => [
                'id' => $user->getId(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
            ], $group->getMembers()->toArray()),
            $group->getCreatedAt()->format('c'),
        );
    }
}
