#!/bin/bash
NODE_VERSION_VAR=12.6.0
NVM_INSTALL_PATH_VAR=~/.nvm/versions/node/v$NODE_VERSION_VAR

export NODE_PATH=$NVM_INSTALL_PATH_VAR/lib/node_modules
export PATH=$NVM_INSTALL_PATH_VAR/bin:$PATH

echo "---Set chmod"
sudo chmod -R 755 /var/www/topnal_demo_cicd
echo "---cd to project" 
cd /var/www/topnal_demo_cicd

node -v
npm -v
pwd

echo "---Npm install"
npm install