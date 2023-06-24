FROM node:18.16.0 as build

WORKDIR /app

COPY src ./src

COPY public ./public

COPY config ./config

COPY next.config.js .

COPY tsconfig.json .

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN npm ci --silent

RUN npm run build --if-present

CMD ["npm", "start"]
