FROM node:8.15.1-alpine

#WORKDIR /

# Copy files into the working directory
COPY package.json /var/www/botchan_api/

WORKDIR /var/www/botchan_api/

# To handle 'not get uid/gid'
RUN npm config set unsafe-perm true

RUN rm -f package-lock.json

RUN npm install
RUN npm install forever -g

COPY . .

# Run file
#CMD ["forever", "--uid", "botchan_api", "--append", "start", "bin/www"]
CMD [ "node", "bin/www" ]