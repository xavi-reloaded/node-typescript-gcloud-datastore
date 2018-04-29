FROM node:6.11.5

RUN apt-get update && apt-get install -y curl git zip  && apt-get clean all

RUN mkdir -p /var/app
WORKDIR /var/app

COPY package.json /var/app/package.json
COPY key.json /var/app/key.json
COPY tsconfig.json /var/app/tsconfig.json
COPY src /var/app/src

RUN npm install
RUN npm build

COPY init.sh /var/app/init.sh

CMD bash init.sh