# ==============================
# Stage 1: Build Angular App
# ==============================
FROM node:22 AS build
WORKDIR /app

# Salin package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file project yang diperlukan untuk build
COPY angular.json ./
COPY tsconfig*.json ./
COPY src ./src
COPY public ./public  # jika ada folder public

# Build Angular untuk production
RUN npm run build

# Debug (opsional) untuk cek hasil build
# RUN ls -R /app/dist

# ==============================
# Stage 2: Serve dengan Nginx
# ==============================
FROM nginx:alpine

# Hapus default content Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy hasil build Angular ke Nginx
COPY --from=build /app/dist/browser/ /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html

# Copy konfigurasi Nginx untuk SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
