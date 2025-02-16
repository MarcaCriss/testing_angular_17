
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build --configuration=production

FROM nginx:alpine

COPY --from=builder /app/dist/test_angular_17 /usr/share/nginx/html

EXPOSE 80
