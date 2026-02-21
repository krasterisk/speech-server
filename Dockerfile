FROM node:22-slim

WORKDIR /app/speech-server

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копируем код и билдим
COPY . .
RUN npm run build

# Удаляем dev-зависимости
RUN npm prune --production

CMD ["node", "dist/main.js"]
