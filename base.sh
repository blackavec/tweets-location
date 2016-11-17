#!/usr/bin/env bash

PORT=8081

IFS='' read -r -d '' HELP <<'EOF'
    -h show you the help of the script.
    -p change the running port, the default is 8000
    -e set php environment
EOF

while getopts ":p:e:" option; do
  case $option in
    p) PORT="$OPTARG";;
    e) ENV="$OPTARG";;
    \?) echo "$HELP"; exit ;;
    :) echo "$HELP"; exit ;;
  esac
done
