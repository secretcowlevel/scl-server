FROM node:alpine

RUN apk --no-cache --update add \
  build-base \
  python3

WORKDIR /usr/app

COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./environment.d.ts ./
COPY ./src ./

RUN yarn install
RUN yarn tsc

CMD [ "yarn", "prod:serve" ]
