require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// Crear la app
const app = express()

// Middlewares globales
app.use(cors())
app.use(express.json())

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err))

// Rutas principales (ejemplo)
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/students', require('./routes/student.routes'))
// Agrega aquí más rutas según tu proyecto

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Liceo Libertador funcionando' })
})

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Error interno del servidor' })
})

// Levantar el servidor
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})