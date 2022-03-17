#!/bin/bash
NODE_VERSION="12.6.0"
NVM_DIR="~/.nvm/nvm.sh"
NVM_INSTALL_PATH $NVM_DIR/versions/node/v$NODE_VERSION

NODE_PATH $NVM_INSTALL_PATH/lib/node_modules
PATH $NVM_INSTALL_PATH/bin:$PATH


cd /var/www/topnal_demo_cicd

node -v
npm -v

npm install