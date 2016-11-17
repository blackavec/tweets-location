install:
	chmod +x ./install.sh
	chmod +x ./run.sh
	chmod +x ./mysql.sh

	./install.sh

run-local:
	./run.sh -e APP_ENV=local

run-prod:
	./run.sh -e APP_ENV=production

mysql:
	./mysql.sh
