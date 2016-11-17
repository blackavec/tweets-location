install:
	chmod +x ./install.sh
	chmod +x ./run.sh
	chmod +x ./mysql.sh
	chmod +x ./proxy.sh
	chmod +x ./webpack.sh

	./install.sh

run-local:
	./run.sh -e APP_ENV=local

run-prod:
	./run.sh -e APP_ENV=production

mysql:
	./mysql.sh

proxy:
	./proxy.sh

webpack-local:
	./webpack.sh dev

webpack-prod:
	./webpack.sh build
