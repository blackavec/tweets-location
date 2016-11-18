#!/usr/bin/env bash

cd codes

if [[ ! -e ./.env ]]; then
    cp .env.example .env
fi

composer install
composer dumpautoload -o

php artisan key:generate

npm install
sudo bower install --allow-root

cd -
