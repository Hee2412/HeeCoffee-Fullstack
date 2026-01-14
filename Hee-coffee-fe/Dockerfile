FROM node:20-alpine
WORKDIR /app

COPY my-app/package*.json ./
RUN npm install

COPY my-app/ .

RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["npm", "start"]