<?php

namespace App\DTO;

use App\Entity\Country;

class CountryDto
{
    public function __construct(
        public int $id,
        public string $name,
        public string $flag,
    ) {}

    public static function fromEntity(Country $country): self
    {
        return new self(
            $country->getId(),
            $country->getName(),
            $country->getFlag(),
        );
    }
}
