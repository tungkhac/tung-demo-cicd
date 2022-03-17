#!/bin/bash

cd /var/www/topnal_demo_cicd

node -v
npm -v

export NVM_DIR="/home/ubuntu/.nvm" [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

npm install