#!/usr/bin/env bash

source ./base.sh

cd codes

bash -c "$ENV php artisan serve --port $PORT"

cd -