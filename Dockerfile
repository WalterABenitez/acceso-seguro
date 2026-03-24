# Usamos Node.js 18 como base para construir React
FROM node:20

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Indicamos el puerto que usa Vite
EXPOSE 5173

# Arrancamos el servidor de desarrollo de React
CMD ["npm", "run", "dev", "--", "--host"]