#!/bin/sh
set -e
mkdir -p /var/www/symfony/var/cache/prod /var/www/symfony/var/log
chown -R www-data:www-data /var/www/symfony/var
chmod -R 777 /var/www/symfony/var
exec php-fpm
