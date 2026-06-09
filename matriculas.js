const express = require('express');
const router = express.Router();
// ANTES: const db = require('../config/db');
const db = require('./db'); // ✅ AHORA: Apunta al archivo db.js que está suelto a su lado

// 1. LISTAR TODAS LAS MATRÍCULAS (GET)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM matriculas';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. CREAR UNA MATRÍCULA (POST)
router.post('/', (req, res) => {
    const { estudiante, curso, codigo_matricula, costo } = req.body;
    const query = 'INSERT INTO matriculas (estudiante, curso, codigo_matricula, costo) VALUES (?, ?, ?, ?)';
    db.query(query, [estudiante, curso, codigo_matricula, costo], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Matrícula registrada con éxito', id: result.insertId });
    });
});

module.exports = router;
