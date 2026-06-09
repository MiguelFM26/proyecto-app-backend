const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// HACER PÚBLICA LA CARPETA UPLOADS (Para poder ver las fotos desde afuera)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ENLAZAR LAS RUTAS DE PRODUCTOS
// Esto hace que todas las rutas dentro de rutas/productos.js empiecen con /api/productos
// ... código anterior de middlewares ...

// ENLAZAR LAS RUTAS
// ENLAZAR LAS RUTAS (Apuntando a los archivos sueltos en la raíz)
app.use('/api/productos', require('./productos'));
app.use('/api/noticias', require('./noticias')); 
app.use('/api/tareas', require('./tareas'));     
app.use('/api/personas', require('./personas'));
app.use('/api/lugares-turisticos', require('./lugares_turisticos'));
app.use('/api/matriculas', require('./matriculas'));
app.use('/api/vehiculos', require('./vehiculos'));

// ... código posterior de app.listen ...

// Ruta base de información
app.get('/', (req, res) => {
    res.json({ mensaje: "API REST funcionando y ordenada." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
