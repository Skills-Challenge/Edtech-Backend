FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm test
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["node", "dist/src/server.js"]