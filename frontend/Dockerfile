FROM node:18

WORKDIR /user/src/app

COPY package*.json ./

RUN npm i

COPY . ./

CMD ["npm", "run", "dev"]
