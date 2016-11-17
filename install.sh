#!/usr/bin/env bash

cd codes

if [[ ! -e ./.env ]]; then
    cp .env.example .env
fi

php artisan key:generate

composer install
composer dumpautoload -o
npm install

cd -