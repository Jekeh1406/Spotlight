<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260130165209 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE vote_group (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, code VARCHAR(10) NOT NULL, created_at DATETIME NOT NULL, owner_id INT NOT NULL, UNIQUE INDEX UNIQ_3CA9260E77153098 (code), INDEX IDX_3CA9260E7E3C61F9 (owner_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE vote_group_user (vote_group_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_4F85F7C1B706E (vote_group_id), INDEX IDX_4F85F7C1A76ED395 (user_id), PRIMARY KEY (vote_group_id, user_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE vote_group ADD CONSTRAINT FK_3CA9260E7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE vote_group_user ADD CONSTRAINT FK_4F85F7C1B706E FOREIGN KEY (vote_group_id) REFERENCES vote_group (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE vote_group_user ADD CONSTRAINT FK_4F85F7C1A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE vote_group DROP FOREIGN KEY FK_3CA9260E7E3C61F9');
        $this->addSql('ALTER TABLE vote_group_user DROP FOREIGN KEY FK_4F85F7C1B706E');
        $this->addSql('ALTER TABLE vote_group_user DROP FOREIGN KEY FK_4F85F7C1A76ED395');
        $this->addSql('DROP TABLE vote_group');
        $this->addSql('DROP TABLE vote_group_user');
    }
}
