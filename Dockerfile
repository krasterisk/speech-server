FROM node:22-slim

WORKDIR /app/speech-server

# Установка зависимостей
COPY package*.json ./
RUN npm install -g pm2 && npm install

# Копируем код и билдим
COPY . .
RUN npm run build


# Загрузка и установка модели Vosk
RUN apt-get update && apt-get install -y wget unzip && rm -rf /var/lib/apt/lists/* && \
    mkdir -p dist/model && \
    wget -O model.zip https://alphacephei.com/vosk/models/vosk-model-ru-0.42.zip && \
    unzip model.zip -d dist/model && \
    mv dist/model/vosk-model-ru-0.42/* dist/model/ && \
    rm -rf dist/model/vosk-model-ru-0.42 model.zip

# Удаляем dev-зависимости
RUN npm prune --production

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
