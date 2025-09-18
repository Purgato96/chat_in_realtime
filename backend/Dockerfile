FROM php:8.4-fpm

WORKDIR /var/www/html

RUN apt-get update

RUN apt-get install -y \
    apt-transport-https \
    ca-certificates \
    git \
    curl \
    zip \
    unzip

RUN apt-get install -y \
    libpq-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev

RUN docker-php-ext-install pdo
RUN docker-php-ext-install pdo_pgsql
RUN docker-php-ext-install mbstring
RUN docker-php-ext-install bcmath
RUN docker-php-ext-install zip
RUN docker-php-ext-install gd

RUN pecl install redis && docker-php-ext-enable redis

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . .

RUN composer install --no-dev --optimize-autoloader \
  && chown -R www-data:www-data /var/www/html \
  && chmod -R 755 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
