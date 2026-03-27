FROM php:8.2-apache
 
RUN apt-get update && apt-get install -y \
    locales \
    wget \
    git \
    libpng-dev \
    libjpeg-dev \
    libpq-dev \
    libfreetype6-dev \
    unzip \
    zlib1g-dev \
    freetds-bin \
    freetds-dev \
    freetds-common \
    libsybdb5 && \
    ln -s /usr/lib/x86_64-linux-gnu/libsybdb.so /usr/lib/ && \
    docker-php-ext-install pdo pdo_dblib && \
    docker-php-ext-configure pdo_dblib --with-libdir=lib/x86_64-linux-gnu && \
    apt-get install -y bash && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
 
# Gerar locale PT-BR e configurar timezone
RUN echo "pt_BR.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen "pt_BR.UTF-8" && \
    dpkg-reconfigure --frontend=noninteractive locales && \
    update-locale LANG="pt_BR.UTF-8" && \
    ln -fs /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata
 
 
# Install Postgre PDO
RUN apt-get install -y libpq-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql
 
# Install GD
RUN docker-php-ext-configure gd --with-jpeg --with-freetype && \
    docker-php-ext-install gd
 
# rewrite
RUN a2enmod rewrite
 
#composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php composer-setup.php --install-dir=/usr/local/bin --filename=composer
RUN php -r "unlink('composer-setup.php');"
 
COPY . /var/www/html
 
WORKDIR /var/www/html
 
RUN mkdir -p /var/www/html/logs && \
    chmod -R 777 /var/www/html/ && \
    chown -R www-data:www-data /var/www/html
 
RUN composer install --ignore-platform-reqs
 
# DataDog
RUN wget https://github.com/DataDog/dd-trace-php/releases/latest/download/datadog-setup.php -O datadog-setup.php
RUN php datadog-setup.php --php-bin all
 
# Sockets
RUN docker-php-ext-install sockets
 
# AddDefaultCharset UTF-8
RUN echo "AddDefaultCharset UTF-8" >> /etc/apache2/apache2.conf
 
# Bcmath
RUN docker-php-ext-install bcmath
 
RUN rm /usr/local/etc/php/php*

RUN printf "%s\n" \
    "date.timezone = America/Sao_Paulo" \
    "memory_limit = 512M" \
    "upload_max_filesize = 64M" \
    "post_max_size = 64M" \
    "max_execution_time = 120" \
    "max_input_vars = 3000" \
    "display_errors = On" \
    "display_startup_errors = On" \
    "log_errors = On" \
    "error_reporting = E_ALL" \
    > /usr/local/etc/php/php.ini && \
    printf "%s\n" \
    "ServerTokens Prod" \
    "ServerSignature Off" \
    "TraceEnable Off" \
    > /etc/apache2/conf-available/security.conf
 
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

USER www-data

EXPOSE 80
