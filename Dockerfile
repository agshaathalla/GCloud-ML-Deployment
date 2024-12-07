FROM node:18

WORKDIR /src/app

COPY package*.json ./

RUN npm install

ENV HOST 0.0.0.0

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]