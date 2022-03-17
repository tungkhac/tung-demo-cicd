#!/bin/bash
NODE_VERSION_VAR=12.6.0
NVM_DIR_VAR=~/.nvm/nvm.sh


# Install nvm
curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source $NVM_DIR_VAR
nvm install $NODE_VERSION_VAR
nvm alias default $NODE_VERSION_VAR
nvm use default

node -v
npm -v

npm install forever -g