import { useState } from 'react'
import './App.css'
import api from './api/axios'

function App() {
  const [pantalla, setPantalla] = useState('login')
  const [error, setError] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerNombre, setRegisterNombre] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  // Limpia errores y campos al cambiar de pantalla
  function cambiarPantalla(nuevaPantalla) {
    setError('')
    setPantalla(nuevaPantalla)
  }

  // Valida datos y llama a la API de login
  async function manejarLogin() {
    if (loginEmail === '') {
      setError('El email no puede estar vacío')
      return
    }
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)
    if (!emailValido) {
      setError('Ingresá un email válido')
      return
    }
    if (loginPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      // Envía los datos al backend y espera la respuesta
      const respuesta = await api.post('/auth/login', {
        email: loginEmail,
        password: loginPassword
      })
      // Login exitoso
      alert('Bienvenido ' + respuesta.data.usuario.nombre)
      setError('')
    } catch (error) {
      // Muestra el error que devolvió el servidor
      setError(error.response?.data?.error || 'Error al iniciar sesión')
    }
  }

  // Valida datos y llama a la API de registro
  async function manejarRegister() {
    if (registerNombre === '') {
      setError('El nombre no puede estar vacío')
      return
    }
    if (registerEmail === '') {
      setError('El email no puede estar vacío')
      return
    }
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail)
    if (!emailValido) {
      setError('Ingresá un email válido')
      return
    }
    if (registerPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      // Envía los datos al backend
      await api.post('/auth/register', {
        nombre: registerNombre,
        email: registerEmail,
        password: registerPassword
      })
      // Registro exitoso — volvemos al login
      alert('Cuenta creada correctamente. Ya podés iniciar sesión.')
      cambiarPantalla('login')
    } catch (error) {
      setError(error.response?.data?.error || 'Error al registrarse')
    }
  }

  return (
    <div className="contenedor">

      {pantalla === 'login' && (
        // form en lugar de div — activa el comportamiento nativo del Enter
        // onSubmit se ejecuta cuando el usuario presiona Enter o el botón
        // e.preventDefault() evita que el navegador recargue la página
        <form className="formulario" onSubmit={(e) => {
          e.preventDefault()
          manejarLogin()
        }}>
          <h2>Iniciar sesión</h2>

          <input
            type="email"
            placeholder="Tu email"
            value={loginEmail}
            onChange={(e) => {
              setLoginEmail(e.target.value)
              setError('')
            }}
          />

          <input
            type="password"
            placeholder="Tu contraseña"
            value={loginPassword}
            onChange={(e) => {
              setLoginPassword(e.target.value)
              setError('')
            }}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Entrar</button>

          <p>
            ¿No tenés cuenta?{' '}
            <span onClick={() => cambiarPantalla('register')}>
              Registrate
            </span>
          </p>
        </form>
      )}

      {pantalla === 'register' && (
        // Mismo comportamiento que el login — Enter activa el registro
        <form className="formulario" onSubmit={(e) => {
          e.preventDefault()
          manejarRegister()
        }}>
          <h2>Crear cuenta</h2>

          <input
            type="text"
            placeholder="Tu nombre"
            value={registerNombre}
            onChange={(e) => setRegisterNombre(e.target.value)}
          />

          <input
            type="email"
            placeholder="Tu email"
            value={registerEmail}
            onChange={(e) => {
              setRegisterEmail(e.target.value)
              setError('')
            }}
          />

          <input
            type="password"
            placeholder="Tu contraseña"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Registrarse</button>

          <p>
            ¿Ya tenés cuenta?{' '}
            <span onClick={() => cambiarPantalla('login')}>
              Iniciá sesión
            </span>
          </p>
        </form>
      )}

    </div>
  )
}

export default App