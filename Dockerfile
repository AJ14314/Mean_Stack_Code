FROM node:10-alpine3.11

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod -R 777 /usr/src/app

EXPOSE 3000

CMD ["npm","run","start:server"]