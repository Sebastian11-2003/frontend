# Stage 1: Build Angular App
FROM node:22 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve dengan Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# Copy hasil build Angular ke Nginx
COPY --from=build /app/dist/browser/ /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
