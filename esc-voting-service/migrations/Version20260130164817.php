<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260130164817 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE vote CHANGE note_voix note_voix DOUBLE PRECISION NOT NULL, CHANGE note_musique note_musique DOUBLE PRECISION NOT NULL, CHANGE note_interpretation note_interpretation DOUBLE PRECISION NOT NULL, CHANGE note_mise_en_scene note_mise_en_scene DOUBLE PRECISION NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE vote CHANGE note_voix note_voix INT NOT NULL, CHANGE note_musique note_musique INT NOT NULL, CHANGE note_interpretation note_interpretation INT NOT NULL, CHANGE note_mise_en_scene note_mise_en_scene INT NOT NULL');
    }
}
