# Базовый образ для сборки
FROM ubuntu:22.04 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем необходимые зависимости
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем остальные файлы и собираем приложение
COPY . .
RUN yarn build

# Создаем минимальный образ для запуска
FROM ubuntu:22.04 AS production

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем Node.js и Yarn для запуска приложения
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Копируем собранные файлы из предыдущего этапа
COPY --from=build /app/build ./build
COPY --from=build /app/package.json /app/yarn.lock ./

# Устанавливаем только production-зависимости
RUN yarn install --production --frozen-lockfile

COPY craco.config.js /app/craco.config.js

# Устанавливаем переменные окружения
ENV HOST=0.0.0.0
EXPOSE 3000

# Команда для запуска приложения
CMD ["yarn", "start"]
