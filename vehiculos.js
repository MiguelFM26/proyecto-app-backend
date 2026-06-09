const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. LISTAR TODOS LOS VEHÍCULOS (GET)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM vehiculos';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. REGISTRAR UN VEHÍCULO (POST)
router.post('/', (req, res) => {
    const { marca, modelo, placa, anio, color } = req.body;
    const query = 'INSERT INTO vehiculos (marca, modelo, placa, anio, color) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [marca, modelo, placa, anio, color], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Vehículo registrado con éxito', id: result.insertId });
    });
});

module.exports = router;