#!/usr/bin/env bash

source ./base.sh

cd codes

echo "$ENV php artisan serve --host=$HOST --port $PORT"
bash -c "$ENV php artisan serve --host=$HOST --port $PORT"

cd -