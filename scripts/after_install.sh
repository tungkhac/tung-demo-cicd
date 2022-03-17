#!/bin/bash
#NODE_VERSION=12.6.0
#NVM_DIR=~/.nvm/nvm.sh
#NVM_INSTALL_PATH=$NVM_DIR/versions/node/v$NODE_VERSION

export NODE_PATH=~/.nvm/versions/node/v12.6.0/lib/node_modules
export PATH=~/.nvm/versions/node/v12.6.0/bin:$PATH

sudo chmod -R 755 /var/www/topnal_demo_cicd 
cd /var/www/topnal_demo_cicd

node -v
npm -v

npm install