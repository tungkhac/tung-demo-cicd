#!/bin/bash
NODE_VERSION_VAR=12.6.0
NVM_INSTALL_PATH_VAR=~/.nvm/versions/node/v$NODE_VERSION_VAR

export PATH=$NVM_INSTALL_PATH_VAR/bin:$PATH

cd /var/www/topnal_demo_cicd

# Stop all servers and start the server as a daemon
forever --version
forever stop /var/www/topnal_demo_cicd/bin/www
forever --uid "topnal_demo_cicd" --append start bin/www