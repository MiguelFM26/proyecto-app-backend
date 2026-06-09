const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. LISTAR TODAS LAS TAREAS (GET)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM tareas';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. CREAR UNA TAREA (POST)
router.post('/', (req, res) => {
    const { titulo, descripcion, fecha_limite } = req.body;
    const query = 'INSERT INTO tareas (titulo, descripcion, fecha_limite) VALUES (?, ?, ?)';
    db.query(query, [titulo, descripcion, fecha_limite], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Tarea creada con éxito', id: result.insertId });
    });
});

// 3. EDITAR UNA TAREA (PUT)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, fecha_limite, completada } = req.body;
    const query = 'UPDATE tareas SET titulo = ?, descripcion = ?, fecha_limite = ?, completada = ? WHERE id = ?';
    db.query(query, [titulo, descripcion, fecha_limite, completada, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        res.json({ mensaje: 'Tarea actualizada con éxito' });
    });
});

// 4. ELIMINAR UNA TAREA (DELETE)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tareas WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        res.json({ mensaje: 'Tarea personalizada eliminada' });
    });
});

module.exports = router;