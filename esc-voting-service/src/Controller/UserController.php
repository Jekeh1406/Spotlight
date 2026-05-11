<?php

namespace App\Controller;

use App\DTO\ChangePasswordDto;
use App\DTO\RegisterDto;
use App\DTO\UpdateProfileDto;
use App\DTO\UserDto;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class UserController extends AbstractController
{
    #[Route('/api/register', methods: ['POST'])]
    public function register(
        Request $request,
        ValidatorInterface $validator,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em,
        UserRepository $userRepository,
        JWTTokenManagerInterface $jwtManager,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $dto = new RegisterDto(
            email: $data['email'] ?? null,
            password: $data['password'] ?? null,
            firstName: $data['firstName'] ?? null,
            lastName: $data['lastName'] ?? null,
        );

        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $messages], Response::HTTP_BAD_REQUEST);
        }

        if ($userRepository->findOneBy(['email' => $dto->email])) {
            return new JsonResponse(['error' => 'Email already in use'], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($dto->email);
        $user->setFirstName($dto->firstName);
        $user->setLastName($dto->lastName);
        $user->setPassword($passwordHasher->hashPassword($user, $dto->password));

        $em->persist($user);
        $em->flush();

        return new JsonResponse([
            'token' => $jwtManager->create($user),
            'user' => UserDto::fromEntity($user),
        ], Response::HTTP_CREATED);
    }

    #[Route('/api/profile', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function updateProfile(
        Request $request,
        ValidatorInterface $validator,
        EntityManagerInterface $em,
        UserRepository $userRepository,
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        $dto = new UpdateProfileDto(
            email: $data['email'] ?? null,
            firstName: $data['firstName'] ?? null,
            lastName: $data['lastName'] ?? null,
        );

        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $messages], Response::HTTP_BAD_REQUEST);
        }

        // Check if email is already used by another user
        $existingUser = $userRepository->findOneBy(['email' => $dto->email]);
        if ($existingUser && $existingUser->getId() !== $user->getId()) {
            return new JsonResponse(['error' => 'Email already in use'], Response::HTTP_CONFLICT);
        }

        $user->setEmail($dto->email);
        $user->setFirstName($dto->firstName);
        $user->setLastName($dto->lastName);

        $em->flush();

        return new JsonResponse([
            'user' => UserDto::fromEntity($user),
        ]);
    }

    #[Route('/api/profile/password', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function changePassword(
        Request $request,
        ValidatorInterface $validator,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em,
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        $dto = new ChangePasswordDto(
            currentPassword: $data['currentPassword'] ?? null,
            newPassword: $data['newPassword'] ?? null,
        );

        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $messages], Response::HTTP_BAD_REQUEST);
        }

        // Verify current password
        if (!$passwordHasher->isPasswordValid($user, $dto->currentPassword)) {
            return new JsonResponse(['error' => 'Current password is incorrect'], Response::HTTP_UNAUTHORIZED);
        }

        // Check that new password is different from current
        if ($passwordHasher->isPasswordValid($user, $dto->newPassword)) {
            return new JsonResponse(['error' => 'New password must be different from current password'], Response::HTTP_BAD_REQUEST);
        }

        $user->setPassword($passwordHasher->hashPassword($user, $dto->newPassword));
        $em->flush();

        return new JsonResponse(['message' => 'Password changed successfully']);
    }
}
