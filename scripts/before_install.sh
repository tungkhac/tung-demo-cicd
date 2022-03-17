#!/bin/bash
NODE_VERSION=12.6.0
NVM_DIR=~/.nvm/nvm.sh


# Install nvm
curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source $NVM_DIR
nvm install $NODE_VERSION
nvm alias default $NODE_VERSION
nvm use default

node -v
npm -v

npm install forever -g