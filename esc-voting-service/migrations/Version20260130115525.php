<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260130115525 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE vote (id SERIAL NOT NULL, note_voix INT NOT NULL, note_musique INT NOT NULL, note_interpretation INT NOT NULL, note_mise_en_scene INT NOT NULL, user_id INT NOT NULL, song_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_5A108564A76ED395 ON vote (user_id)');
        $this->addSql('CREATE INDEX IDX_5A108564A0BDB2F3 ON vote (song_id)');
        $this->addSql('ALTER TABLE vote ADD CONSTRAINT FK_5A108564A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE vote ADD CONSTRAINT FK_5A108564A0BDB2F3 FOREIGN KEY (song_id) REFERENCES song (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE vote DROP CONSTRAINT FK_5A108564A76ED395');
        $this->addSql('ALTER TABLE vote DROP CONSTRAINT FK_5A108564A0BDB2F3');
        $this->addSql('DROP TABLE vote');
    }
}
