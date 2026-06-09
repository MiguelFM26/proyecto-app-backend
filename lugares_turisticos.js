const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// Configuración de Multer para guardar las fotos de los paisajes/lugares
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'lugar_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 1. LISTAR TODOS LOS LUGARES (GET)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM lugares_turisticos';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. CREAR UN LUGAR (POST) - Con foto, Latitud y Longitud
router.post('/', upload.single('foto'), (req, res) => {
    const { nombre, descripcion, latitud, longitud } = req.body;
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nombre || !latitud || !longitud) {
        return res.status(400).json({ mensaje: 'Nombre, latitud y longitud son obligatorios.' });
    }

    const query = 'INSERT INTO lugares_turisticos (nombre, descripcion, latitud, longitud, imagen_url) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre, descripcion, latitud, longitud, imagen_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            mensaje: 'Lugar turístico registrado con éxito',
            id: result.insertId,
            foto_url: imagen_url
        });
    });
});

// 3. EDITAR UN LUGAR (PUT /:id) - REQUISITO OBLIGATORIO DE CRUD
router.put('/:id', upload.single('foto'), (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, latitud, longitud } = req.body;
    
    // Si sube una nueva foto, se actualiza la ruta; si no, se evalúa mantener la anterior
    let query = 'UPDATE lugares_turisticos SET nombre = ?, descripcion = ?, latitud = ?, longitud = ?';
    let params = [nombre, descripcion, latitud, longitud];

    if (req.file) {
        const imagen_url = `/uploads/${req.file.filename}`;
        query += ', imagen_url = ?';
        params.push(imagen_url);
    }

    query += ' WHERE id = ?';
    params.push(id);

    if (!nombre || !latitud || !longitud) {
        return res.status(400).json({ mensaje: 'Nombre, latitud y longitud son requeridos para actualizar.' });
    }

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Lugar turístico no encontrado.' });
        
        res.json({ mensaje: 'Lugar turístico actualizado con éxito' });
    });
});

// 4. ELIMINAR UN LUGAR (DELETE /:id) - REQUISITO OBLIGATORIO DE CRUD
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM lugares_turisticos WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Lugar turístico no encontrado.' });
        
        res.json({ mensaje: 'Lugar turístico eliminado correctamente de la base de datos' });
    });
});

module.exports = router;