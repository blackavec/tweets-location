# Preparation
To set everything up and running you need to have docker installed on your system
```
# minimum requirements
$ docker -v
Docker version 1.12.3, build 6b644ec, experimental

$ docker-compose -v
docker-compose version 1.9.0-rc4, build 181a4e9
```

# install
To install the app you just need to use the following commands:
```
# to install dependencies
$ make install
# to run the mysql and phpmyadmin on docker
$ make mysql
# to start serving the app with on local environment 
$ make run-local
# to start serving the app with on production environment 
$ make run-prod
```