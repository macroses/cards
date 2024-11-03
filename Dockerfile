# Базовый образ Node.js
FROM node:20-alpine

# Создаем директорию приложения
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем приложение
RUN npm run build

# Открываем порт
EXPOSE 3030

# Запускаем приложение
CMD ["node", ".output/server/index.mjs"]