# === Stage 1: Build Angular ===
FROM node:22-bullseye-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration production --verbose

# === Stage 2: NGINX Serve ===
FROM nginx:alpine

# Hapus default HTML bawaan Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy hasil build dari stage sebelumnya
COPY --from=build /app/dist/browser/ /usr/share/nginx/html/

# Set permission & expose port
RUN chmod -R 755 /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
