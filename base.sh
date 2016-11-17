#!/usr/bin/env bash

PORT=8081
HOST="localhost"

IFS='' read -r -d '' HELP <<'EOF'
    -a set the custom hostfile, the default is localhost
    -e set php environment
    -h show you the help of the script.
    -p change the running port, the default is 8000
EOF

while getopts ":a:e:p:" option; do
  case $option in
    a) HOST="$OPTARG";;
    e) ENV="$OPTARG";;
    p) PORT="$OPTARG";;
    \?) echo "$HELP"; exit ;;
    :) echo "$HELP"; exit ;;
  esac
done
