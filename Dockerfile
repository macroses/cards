FROM node:18-alpine

# Устанавливаем необходимые системные зависимости
RUN apk add --no-cache openssl openssl-dev

WORKDIR /app

# Создаем пользователя node и назначаем права
RUN chown -R node:node /app

# Переключаемся на пользователя node
USER node

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

# Создаем директорию для базы данных
RUN mkdir -p prisma

# Генерируем Prisma клиент
RUN npx prisma generate

# Создаем пустую базу данных
RUN touch prisma/dev.db

# Применяем миграции
RUN npx prisma migrate deploy

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"] 