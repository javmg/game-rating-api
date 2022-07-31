FROM node:16-alpine3.14

WORKDIR /usr/app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY tsoa.json tsoa.json

COPY config ./config
COPY src ./src

RUN npm install --omit=dev

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]


