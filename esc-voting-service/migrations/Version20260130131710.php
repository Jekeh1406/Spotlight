<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260130131710 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE song RENAME COLUMN performance_order TO "order"');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE song RENAME COLUMN "order" TO performance_order');
    }
}
