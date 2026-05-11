<?php

namespace App\Repository;

use App\Entity\VoteGroup;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VoteGroup>
 */
class VoteGroupRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VoteGroup::class);
    }

    public function findByCode(string $code): ?VoteGroup
    {
        return $this->findOneBy(['code' => $code]);
    }
}
