#!/bin/sh

cd "$(dirname "$0")"

sudo apt upgrade
sudo apt update

# Install vim
if ! command -v vim &> /dev/null
then
	sudo apt install -y vim
fi


# Install latest version of nodejs
if ! command -v node &> /dev/null
then
	curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
	sudo apt install -y nodejs
fi

# install yarn
if ! command -v yarn &> /dev/null
then
	curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
	echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
	sudo apt-get update && sudo apt-get install yarn
fi

cd ../pi-scripts
echo "PATH=$PATH:$(pwd)" >> ~/.bashrc # Add scripts to the path


yarn global add @nestjs/cli pm2


# Add yarn to path if command isn't found
if ! command -v nest &> /dev/null
then
	echo "PATH=$PATH:$(yarn global bin)" >> ~/.bashrc
fi

# Setup SSL if letsencrypt files doesn't exsit
if ! [ -d /etc/letsencrypt ]
then
	sudo apt install -y snapd
	sudo snap install core; sudo snap refresh core
	sudo groupadd ssl-cert
	sudo chgrp -R ssl-cert /etc/letsencrypt
	sudo chmod -R g=rX /etc/letsencrypt
fi

# Install NGINX
sudo apt-get install nginx
sudo /etc/init.d/nginx start

