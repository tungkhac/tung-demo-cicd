#!/bin/bash

# Stop all servers and start the server as a daemon
forever --version
forever stop /var/www/topnal_demo_cicd/bin/www
forever start --uid "topnal_demo_cicd" /var/www/topnal_demo_cicd/bin/www