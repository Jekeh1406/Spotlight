<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260116132806 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE country (id SERIAL NOT NULL, name VARCHAR(255) NOT NULL, flag VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE song (id SERIAL NOT NULL, title VARCHAR(255) NOT NULL, artist VARCHAR(255) NOT NULL, country_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_33EDEEA1F92F3E70 ON song (country_id)');
        $this->addSql('ALTER TABLE song ADD CONSTRAINT FK_33EDEEA1F92F3E70 FOREIGN KEY (country_id) REFERENCES country (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE song DROP CONSTRAINT FK_33EDEEA1F92F3E70');
        $this->addSql('DROP TABLE country');
        $this->addSql('DROP TABLE song');
    }
}
