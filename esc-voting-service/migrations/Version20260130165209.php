<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260130165209 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE vote_group (id SERIAL NOT NULL, name VARCHAR(255) NOT NULL, code VARCHAR(10) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, owner_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_3CA9260E77153098 ON vote_group (code)');
        $this->addSql('CREATE INDEX IDX_3CA9260E7E3C61F9 ON vote_group (owner_id)');
        $this->addSql('CREATE TABLE vote_group_user (vote_group_id INT NOT NULL, user_id INT NOT NULL, PRIMARY KEY(vote_group_id, user_id))');
        $this->addSql('CREATE INDEX IDX_4F85F7C1B706E ON vote_group_user (vote_group_id)');
        $this->addSql('CREATE INDEX IDX_4F85F7C1A76ED395 ON vote_group_user (user_id)');
        $this->addSql('ALTER TABLE vote_group ADD CONSTRAINT FK_3CA9260E7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE vote_group_user ADD CONSTRAINT FK_4F85F7C1B706E FOREIGN KEY (vote_group_id) REFERENCES vote_group (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE vote_group_user ADD CONSTRAINT FK_4F85F7C1A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE vote_group DROP CONSTRAINT FK_3CA9260E7E3C61F9');
        $this->addSql('ALTER TABLE vote_group_user DROP CONSTRAINT FK_4F85F7C1B706E');
        $this->addSql('ALTER TABLE vote_group_user DROP CONSTRAINT FK_4F85F7C1A76ED395');
        $this->addSql('DROP TABLE vote_group');
        $this->addSql('DROP TABLE vote_group_user');
    }
}
