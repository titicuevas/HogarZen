# =====================================================
# DOCKERFILE - HOGARZEN FRONTEND
# =====================================================

# Usar Node.js 18 Alpine para menor tamaño
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 5173

# Comando por defecto
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 