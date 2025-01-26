FROM node:18-alpine
RUN apk add --no-cache curl libcurl
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# RUN npm test
EXPOSE 8000
CMD ["node", "dist/src/server.js"]