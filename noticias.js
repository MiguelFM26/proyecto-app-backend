const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. LISTAR TODAS LAS NOTICIAS (GET)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM noticias ORDER BY fecha_publicacion DESC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. CREAR UNA NOTICIA (POST)
router.post('/', (req, res) => {
    const { titulo, contenido, imagen_url } = req.body;
    const query = 'INSERT INTO noticias (titulo, contenido, imagen_url) VALUES (?, ?, ?)';
    db.query(query, [titulo, contenido, imagen_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Noticia publicada con éxito', id: result.insertId });
    });
});

// 3. EDITAR UNA NOTICIA (PUT)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, imagen_url } = req.body;
    const query = 'UPDATE noticias SET titulo = ?, contenido = ?, imagen_url = ? WHERE id = ?';
    db.query(query, [titulo, contenido, imagen_url, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Noticia no encontrada' });
        res.json({ mensaje: 'Noticia actualizada con éxito' });
    });
});

// 4. ELIMINAR UNA NOTICIA (DELETE)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM noticias WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Noticia no encontrada' });
        res.json({ mensaje: 'Noticia eliminada con éxito' });
    });
});

module.exports = router;