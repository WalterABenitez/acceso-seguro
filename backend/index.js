const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./db/conexion')
const authRoutes = require('./routes/auth')

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())

// Registramos las rutas de autenticación
// Todo lo que empiece con /api/auth va a este archivo
app.use('/api/auth', authRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor AccesoSeguro funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
