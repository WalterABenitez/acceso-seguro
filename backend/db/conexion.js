const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

// Intenta conectarse a PostgreSQL con reintentos
// Necesario porque Docker puede arrancar el backend antes que la base de datos
const conectar = async (reintentos = 5) => {
  try {
    await pool.connect()
    console.log('Conectado a PostgreSQL correctamente')
  } catch (err) {
    if (reintentos === 0) {
      console.error('No se pudo conectar a PostgreSQL:', err)
      process.exit(1)
    }
    console.log(`PostgreSQL no disponible, reintentando en 3 segundos... (${reintentos} intentos restantes)`)
    // Espera 3 segundos antes de reintentar
    await new Promise(res => setTimeout(res, 3000))
    return conectar(reintentos - 1)
  }
}

conectar()

module.exports = pool