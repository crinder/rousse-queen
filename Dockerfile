# 1. Etapa de construcción (Build)
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Etapa de producción (Servidor ligero)
FROM nginx:stable-alpine AS production-stage
# Copiamos los archivos construidos desde la etapa anterior
# IMPORTANTE: Si usas Vite, la carpeta es 'dist'. Si es Create React App, es 'build'.
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copiamos una configuración básica de Nginx para manejar rutas de SPA
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]