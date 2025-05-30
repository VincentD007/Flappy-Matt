FROM node:slim

WORKDIR /server

COPY . /server

RUN npm install

RUN npx knex migrate:latest

RUN npx knex seed:run

EXPOSE 8080

CMD ["npm", "start"]
