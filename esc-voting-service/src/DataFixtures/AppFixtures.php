<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{

    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}


    public function load(ObjectManager $manager): void
    {

        for ($i=0; $i< 1; $i++){
            $user = $this->createUser();
            $manager->persist($user);
        }
        $manager->flush();
    }

    public function createUser(): User
    {
        $user = new User();
        $user ->setEmail("olivierdick2@gmail.com");
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, 'lala')
        );
        $user ->setRoles(["ROLE_USER"]);
        $user->setLastName("Dick");
        $user ->setFirstName("Olivier");
        return $user;
    }
}
