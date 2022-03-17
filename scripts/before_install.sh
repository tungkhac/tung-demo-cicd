#!/bin/bash

# Install nvm
curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 12.6.0
nvm alias default 12.6.0
nvm use default

sudo npm install forever -g