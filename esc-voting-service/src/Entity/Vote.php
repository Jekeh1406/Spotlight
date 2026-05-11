<?php

namespace App\Entity;

use App\Repository\VoteRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VoteRepository::class)]
class Vote
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Song::class, inversedBy: 'votes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Song $song = null;

    #[ORM\Column(type: 'float')]
    private ?float $noteVoix = null;

    #[ORM\Column(type: 'float')]
    private ?float $noteMusique = null;

    #[ORM\Column(type: 'float')]
    private ?float $noteInterpretation = null;

    #[ORM\Column(type: 'float')]
    private ?float $noteMiseEnScene = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getSong(): ?Song
    {
        return $this->song;
    }

    public function setSong(?Song $song): static
    {
        $this->song = $song;

        return $this;
    }

    public function getNoteVoix(): ?float
    {
        return $this->noteVoix;
    }

    public function setNoteVoix(float $noteVoix): static
    {
        $this->noteVoix = $noteVoix;

        return $this;
    }

    public function getNoteMusique(): ?float
    {
        return $this->noteMusique;
    }

    public function setNoteMusique(float $noteMusique): static
    {
        $this->noteMusique = $noteMusique;

        return $this;
    }

    public function getNoteInterpretation(): ?float
    {
        return $this->noteInterpretation;
    }

    public function setNoteInterpretation(float $noteInterpretation): static
    {
        $this->noteInterpretation = $noteInterpretation;

        return $this;
    }

    public function getNoteMiseEnScene(): ?float
    {
        return $this->noteMiseEnScene;
    }

    public function setNoteMiseEnScene(float $noteMiseEnScene): static
    {
        $this->noteMiseEnScene = $noteMiseEnScene;

        return $this;
    }
}
