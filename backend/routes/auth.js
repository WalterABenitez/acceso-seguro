const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const pool = require('../db/conexion')
const jwt = require('jsonwebtoken')
require('dotenv').config()


// Ruta de registro — recibe nombre, email y contraseña y guarda en la base de datos
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body

  // Verificamos que llegaron todos los datos
  if (!nombre || !email || !password) {
    return res.status(400).json({
      error: 'Todos los campos son obligatorios'
    })
  }

  try {
    // Consultamos si ya existe un usuario con ese email en la base de datos
    const usuarioExiste = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )

    // Si encontró filas significa que el email ya está registrado
    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({
        error: 'Ya existe una cuenta con ese email'
      })
    }

    // Generamos la sal — un valor aleatorio que hace única cada encriptación
    const sal = await bcrypt.genSalt(10)

    // Encriptamos la contraseña antes de guardarla
    const passwordEncriptada = await bcrypt.hash(password, sal)

    // Insertamos el nuevo usuario en la base de datos
    // RETURNING devuelve los datos del usuario recién creado
    const nuevoUsuario = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, passwordEncriptada]
    )

    // Respondemos con los datos del usuario creado — sin la contraseña
    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: nuevoUsuario.rows[0]
    })

  } catch (error) {
    // Si algo falla en la base de datos, capturamos el error y respondemos
    console.error('Error en registro:', error)
    res.status(500).json({
      error: 'Error interno del servidor'
    })
  }
})

// Ruta de login — verifica email y contraseña contra la base de datos
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  // Verificamos que llegaron los datos
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email y contraseña son obligatorios'
    })
  }

  try {
    // Buscamos el usuario por email en la base de datos
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )

    // Si no encontró filas, el email no está registrado
    if (resultado.rows.length === 0) {
      return res.status(400).json({
        error: 'Email o contraseña incorrectos'
      })
    }

    const usuario = resultado.rows[0]

    // Comparamos la contraseña ingresada con la encriptada en la base de datos
    const passwordCorrecta = await bcrypt.compare(password, usuario.password)

    // Si no coinciden, rechazamos el login
    if (!passwordCorrecta) {
      return res.status(400).json({
        error: 'Email o contraseña incorrectos'
      })
    }

    // Generamos el token JWT con los datos del usuario
    // El token contiene id, nombre y email — nunca la contraseña
    // Expira en 24 horas — después el usuario debe volver a loguearse
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Login exitoso — respondemos con el token y los datos del usuario
    res.status(200).json({
      mensaje: 'Login exitoso',
      token: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    })

  } catch (error) {
    // Si algo falla en la base de datos, capturamos el error y respondemos
    console.error('Error en login:', error)
    res.status(500).json({
      error: 'Error interno del servidor'
    })
  }
})

module.exports = router