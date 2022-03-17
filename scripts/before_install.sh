#!/bin/bash
#NODE_VERSION=12.6.0
#NVM_DIR=~/.nvm/nvm.sh


# Install nvm
curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 12.6.0
nvm alias default 12.6.0
nvm use default

node -v
npm -v

npm install forever -g