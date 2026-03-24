# Usamos Node.js versión 18 como base
# Es como decir "arrancá con una computadora que ya tiene Node.js instalado"
FROM node:18

# Creamos una carpeta dentro del contenedor donde va a vivir el código
WORKDIR /app

# Copiamos primero los archivos de dependencias
# Esto permite que Docker use caché si no cambiaron las dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Indicamos en qué puerto escucha el backend
EXPOSE 3000

# Comando que arranca el servidor cuando el contenedor inicia
CMD ["node", "index.js"]