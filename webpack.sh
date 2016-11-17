#!/usr/bin/env bash

source ./base.sh

cd codes

bash -c "npm run webpack-$1"

cd -