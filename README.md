# AccesoSeguro

Sistema de autenticación full stack desarrollado como proyecto personal.

## Tecnologías utilizadas

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **Seguridad:** JWT + bcrypt
- **Infraestructura:** Docker + Docker Compose

## Funcionalidades

- Registro de usuarios con validaciones
- Login con autenticación JWT
- Contraseñas encriptadas con bcrypt
- API REST con rutas protegidas
- Contenedores Docker para cada servicio

## Cómo correr el proyecto

### Con Docker
```bash
docker-compose up --build
```
Abrí http://localhost:5173

### Sin Docker

Terminal 1 — Backend:
```bash
cd backend
npm install
npm run dev
```
Terminal 2 — Frontend:
```bash
npm install
npm run dev
```

## Variables de entorno

Creá un archivo `backend/.env` con:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=acceso_seguro
DB_PASSWORD=tu_contraseña
DB_PORT=5432
JWT_SECRET=tu_clave_secreta
```