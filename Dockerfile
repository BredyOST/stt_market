
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

# Копируем остальные файлы
COPY . .

# Запуск приложения в dev-режиме (если у тебя есть соответствующий скрипт)
CMD ["yarn", "start"]








## Базовый образ для сборки
#FROM ubuntu:24.04 AS build
#
## Устанавливаем рабочую директорию
#WORKDIR /app
#
## Устанавливаем необходимые зависимости
#RUN apt-get update && apt-get install -y \
#    curl \
#    gnupg \
#    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
#    && apt-get install -y nodejs \
#    && npm install -g yarn \
#    && apt-get clean \
#    && rm -rf /var/lib/apt/lists/*
#
## Копируем package.json и yarn.lock
#COPY package.json yarn.lock ./
#
## Устанавливаем зависимости
#RUN yarn install --frozen-lockfile
#
## Копируем остальные файлы и собираем приложение
#COPY . .
#RUN yarn build
#
## Финальный минимальный образ
#FROM nginx:alpine AS production
#
## Устанавливаем рабочую директорию Nginx
#WORKDIR /usr/share/nginx/html
#
## Копируем собранное приложение из стадии сборки
#COPY --from=build /app/build ./
#
## Настраиваем конфигурацию Nginx (опционально)
## COPY nginx.conf /etc/nginx/conf.d/default.conf
#
## Экспонируем порт 80
#EXPOSE 80
#ENV HOST=0.0.0.0
#
## Команда по умолчанию для запуска Nginx
#CMD ["nginx", "-g", "daemon off;"]
