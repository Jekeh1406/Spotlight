FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
        icu-libs \
        libzip \
        libpq \
    && apk add --no-cache --virtual .build-deps \
        icu-dev \
        libzip-dev \
        postgresql-dev \
    && docker-php-ext-install \
        intl \
        pdo_pgsql \
        zip \
        opcache \
    && apk del .build-deps

RUN printf "opcache.enable=1\nopcache.memory_consumption=128\nopcache.max_accelerated_files=10000\nopcache.revalidate_freq=60\n" \
    > /usr/local/etc/php/conf.d/opcache.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/symfony

COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

COPY . .

RUN composer dump-autoload --optimize --no-dev \
    && rm -rf var/cache/* var/log/* \
    && mkdir -p var/cache var/log \
    && chown -R www-data:www-data var/ \
    && chmod -R 777 var/

EXPOSE 9000
CMD ["php-fpm"]
