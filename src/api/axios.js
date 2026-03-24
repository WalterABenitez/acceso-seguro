import axios from 'axios'

// Creamos una instancia de axios con la URL base del backend
// Así no tenemos que escribir la URL completa en cada pedido
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

export default api