FROM php:7.1-rc-fpm

MAINTAINER Mahan Hazrati <eng.mahan.hazrati@gmail.com>

WORKDIR /var/www/

CMD ./run.sh -p 80 -a 0.0.0.0 -e APP_ENV=local

EXPOSE 80/tcp
EXPOSE 8081/tcp
