# Проект API
Это backend-часть приложения, 
предоставляющая API с документацией через Swagger.

## Требования
- Node.js 20+
- Docker 
- PostgreSQL (может быть запущен через Docker)


## Установка и запуск
Склонируйте репозиторий:

git clone <ваш-репозиторий>
cd <папка-проекта>
npm install

## Переменные окружения
Основные переменные окружения (.env файл):

DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET=your_jwt_secret_key
PORT=3000

##  Docker
Запуск:
docker-compose up -d

Остановка:
docker-compose down

##  Работа с базой данных (Prisma)
Генерация клиента Prisma
npm run prisma:generate

Применение миграций
npm run prisma:migrate

Запуск Prisma Studio 
(админка БД)
npm run prisma:studio
http://localhost:5555

## Запуск приложения
npm run dev
## Продакшен сборка
npm run build

npm start

##  API Документация
После запуска приложения 
документация доступна по адресу:
http://localhost:<порт>/api-docs

🔗 [Swagger UI](http://localhost:3000/api-docs) 



