<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class ChangePasswordDto
{
    public function __construct(
        #[Assert\NotBlank(message: 'Current password is required')]
        public readonly ?string $currentPassword = null,

        #[Assert\NotBlank(message: 'New password is required')]
        #[Assert\Length(
            min: 8,
            minMessage: 'Password must be at least {{ limit }} characters long'
        )]
        #[Assert\Regex(
            pattern: '/[A-Z]/',
            message: 'Password must contain at least one uppercase letter'
        )]
        #[Assert\Regex(
            pattern: '/[a-z]/',
            message: 'Password must contain at least one lowercase letter'
        )]
        #[Assert\Regex(
            pattern: '/[0-9]/',
            message: 'Password must contain at least one digit'
        )]
        #[Assert\Regex(
            pattern: '/[!@#$%^&*(),.?":{}|<>]/',
            message: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
        )]
        public readonly ?string $newPassword = null,
    ) {}
}
