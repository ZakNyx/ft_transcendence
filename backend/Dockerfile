FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN sleep 10

RUN npx prisma migrate dev --name init

CMD ["npm", "run", "start:dev"]
