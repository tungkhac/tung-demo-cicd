#!/bin/bash
NODE_VERSION=12.6.0
NVM_DIR=~/.nvm/nvm.sh
NVM_INSTALL_PATH=$NVM_DIR/versions/node/v$NODE_VERSION

NODE_PATH ~/.nvm/nvm.sh/versions/node/v12.6.0/lib/node_modules
PATH ~/.nvm/nvm.sh/versions/node/v12.6.0/bin:$PATH


cd /var/www/topnal_demo_cicd

node -v
npm -v

npm install