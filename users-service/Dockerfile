FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build \
  && cp -r src/database/migrations dist/database/migrations

EXPOSE 3002

CMD ["node", "dist/server.js"]
