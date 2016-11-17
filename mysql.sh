#!/usr/bin/env bash

MYSQL_CONTAINER_NAME="db-laravel-mysql"
PMA_CONTAINER_NAME="phpmyadmin"
DB_NAME="mydb"
DB_PASSWORD="my-secret-pw"

$(docker rm -f $MYSQL_CONTAINER_NAME &> /dev/null)
$(docker rm -f $PMA_CONTAINER_NAME &> /dev/null)

docker run  -d --name $MYSQL_CONTAINER_NAME \
            -e MYSQL_DATABASE=$DB_NAME \
            -e MYSQL_ROOT_PASSWORD=$DB_PASSWORD \
            -v ~/.data/mysql:/var/lib/mysql \
            -p 33060:3306 \
            -d mysql

docker run --name $PMA_CONTAINER_NAME \
            -d --link $MYSQL_CONTAINER_NAME:db \
            -p 8080:80 phpmyadmin/phpmyadmin