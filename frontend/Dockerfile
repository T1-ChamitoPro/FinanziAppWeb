# ==========================================
# Paso 1: Etapa de compilación (Build Stage)
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependencias aprovechando la caché de capas de Docker
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copiar el código fuente
COPY . .

# Argumento de compilación para la URL de la API (opcional)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Compilar la aplicación React con Vite
RUN npm run build

# ==========================================
# Paso 2: Servidor Nginx para producción (Runtime Stage)
# ==========================================
FROM nginx:1.27-alpine

# Copiar los archivos estáticos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto expuesto por el contenedor
EXPOSE 80

# Chequeo de salud del contenedor
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Comando de ejecución de Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
