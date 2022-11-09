FROM node:19.0-alpine

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json .

COPY yarn.lock .

RUN yarn install --production

COPY . .
