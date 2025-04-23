FROM node:22-alpine
WORKDIR /var/www/speech-server
COPY package*.json ./
RUN npm install -g pm2 && npm install
COPY . .
RUN npm run build
RUN npm prune --production
CMD ["pm2-runtime", "start", "ecosystem.config.js"]


