FROM node:12.6.0-alpine

#WORKDIR /

# Copy files into the working directory
COPY package.json /var/www/topnal_demo_cicd/

WORKDIR /var/www/topnal_demo_cicd/

# To handle 'not get uid/gid'
RUN npm config set unsafe-perm true

RUN rm -f package-lock.json

RUN npm install
RUN npm install forever -g

# Run file
#CMD ["forever", "--uid", "botchan_api", "--append", "start", "bin/www"]
CMD [ "node", "bin/www" ]