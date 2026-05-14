<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260514104104 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Rename user table to app_user';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE vote ADD CONSTRAINT FK_5A108564A76ED395 FOREIGN KEY (user_id) REFERENCES app_user (id)');
        $this->addSql('ALTER TABLE vote_group DROP FOREIGN KEY FK_3CA9260E7E3C61F9');
        $this->addSql('ALTER TABLE vote_group ADD CONSTRAINT FK_3CA9260E7E3C61F9 FOREIGN KEY (owner_id) REFERENCES app_user (id)');
        $this->addSql('ALTER TABLE vote_group_user DROP FOREIGN KEY FK_4F85F7C1A76ED395');
        $this->addSql('ALTER TABLE vote_group_user ADD CONSTRAINT FK_4F85F7C1A76ED395 FOREIGN KEY (user_id) REFERENCES app_user (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE `user`');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, roles JSON NOT NULL, password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, first_name VARCHAR(30) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, last_name VARCHAR(30) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('DROP TABLE app_user');
        $this->addSql('ALTER TABLE vote DROP FOREIGN KEY FK_5A108564A76ED395');
        $this->addSql('ALTER TABLE vote ADD CONSTRAINT `FK_5A108564A76ED395` FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE vote_group DROP FOREIGN KEY FK_3CA9260E7E3C61F9');
        $this->addSql('ALTER TABLE vote_group ADD CONSTRAINT `FK_3CA9260E7E3C61F9` FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE vote_group_user DROP FOREIGN KEY FK_4F85F7C1A76ED395');
        $this->addSql('ALTER TABLE vote_group_user ADD CONSTRAINT `FK_4F85F7C1A76ED395` FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }
}
