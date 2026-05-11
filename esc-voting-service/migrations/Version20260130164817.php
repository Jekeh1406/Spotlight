<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260130164817 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE vote ALTER COLUMN note_voix TYPE DOUBLE PRECISION');
        $this->addSql('ALTER TABLE vote ALTER COLUMN note_musique TYPE DOUBLE PRECISION');
        $this->addSql('ALTER TABLE vote ALTER COLUMN note_interpretation TYPE DOUBLE PRECISION');
        $this->addSql('ALTER TABLE vote ALTER COLUMN note_mise_en_scene TYPE DOUBLE PRECISION');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE vote ALTER COLUMN note_voix TYPE INT');
        $this->addSql('ALTER TABLE vote ALTER COLUMN note_musique TYPE INT');
        $this->addSql('ALTER TABLE vote ALTER COLUMN note_interpretation TYPE INT');
        $this->addSql('ALTER TABLE vote ALTER COLUMN note_mise_en_scene TYPE INT');
    }
}
