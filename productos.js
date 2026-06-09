const express = require('express');
const router = express.Router();
// ANTES: const db = require('../config/db');
const db = require('./db'); // ✅ AHORA: Apunta al archivo db.js que está suelto a su lado

// 1. OBTENER TODOS LOS PRODUCTOS (GET)
// Ruta: http://localhost:3000/api/productos
router.get('/', (req, res) => {
    const query = 'SELECT * FROM productos';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Devuelve la lista de productos en formato JSON
    });
});

// 2. CREAR UN NUEVO PRODUCTO (POST)
// Ruta: http://localhost:3000/api/productos
router.post('/', (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    const query = 'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)';
    
    db.query(query, [nombre, descripcion, precio, stock], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            mensaje: 'Producto creado con éxito', 
            id: result.insertId 
        });
    });
});

// 3. EDITAR UN PRODUCTO EXISTENTE (PUT)
// Ruta: http://localhost:3000/api/productos/:id
router.put('/:id', (req, res) => {
    const { id } = req.params; // Captura el ID que viene en la URL
    const { nombre, descripcion, precio, stock } = req.body;
    
    const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?';
    
    db.query(query, [nombre, descripcion, precio, stock, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Verificamos si encontramos el producto para editarlo
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        
        res.json({ mensaje: 'Producto actualizado con éxito' });
    });
});

// 4. ELIMINAR UN PRODUCTO (DELETE)
// Ruta: http://localhost:3000/api/productos/:id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM productos WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        
        res.json({ mensaje: 'Producto eliminado con éxito' });
    });
});
module.exports = router;
