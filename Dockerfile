# Stage 1: Build Angular
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build aplikasi Angular
RUN npm run build

# Stage 2: Serve dengan Nginx
FROM nginx:alpine

# Hapus file default nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy hasil build Angular (files langsung di dist/, bukan dist/browser/)
COPY --from=build /app/dist/ /usr/share/nginx/html/

RUN chmod -R 755 /usr/share/nginx/html

# Copy konfigurasi nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]