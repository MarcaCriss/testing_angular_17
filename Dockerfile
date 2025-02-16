
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --configuration=production

FROM nginx:alpine

COPY --from=build /usr/src/app/dist/test_angular_17 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
