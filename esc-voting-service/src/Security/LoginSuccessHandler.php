<?php

namespace App\Security;
use App\DTO\UserDto;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    public function __construct(
        private JWTTokenManagerInterface $jwtManager
    ) {}

    public function onAuthenticationSuccess(
        \Symfony\Component\HttpFoundation\Request $request,
        TokenInterface $token
    ): JsonResponse {
        $user = $token->getUser();

        return new JsonResponse([
            'token' => $this->jwtManager->create($user),
            'user'  => UserDto::fromEntity($user),
        ]);
    }
}