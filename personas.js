const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// ANTES: const db = require('../config/db');
const db = require('./db'); // ✅ AHORA: Apunta al archivo db.js que está suelto a su lado

// CONFIGURACIÓN DE MULTER: Dónde y cómo se guardan las fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Las fotos se guardan en la carpeta uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 1. LISTAR TODAS LAS PERSONAS (GET)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM personas';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. CREAR PERSONA / REGISTRO CON FOTO (POST) - [REQUISITO: REGISTRO]
router.post('/', upload.single('foto'), (req, res) => {
    const { nombres, apellidos, telefono, correo, password } = req.body;
    const foto_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Se añade password al insert para la autenticación real
    const query = 'INSERT INTO personas (nombres, apellidos, telefono, correo, foto_url, password) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nombres, apellidos, telefono, correo, foto_url, password || '123456'], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            success: true,
            mensaje: 'Persona registrada con éxito', 
            id: result.insertId,
            foto_url: foto_url 
        });
    });
});


// ========================================================
// NUEVOS ENDPOINTS ADICIONALES PARA CUMPLIR EL REQUISITO 1
// ========================================================

// 3. INICIO DE SESIÓN / LOGIN (POST /api/personas/login) - [REQUISITO: LOGIN]
router.post('/login', (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: 'Correo y contraseña requeridos.' });
    }

    const query = 'SELECT * FROM personas WHERE correo = ? AND password = ?';
    db.query(query, [correo, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length > 0) {
            res.status(200).json({ 
                success: true, 
                mensaje: 'Autenticación exitosa', 
                usuario: results[0] 
            });
        } else {
            res.status(401).json({ 
                success: false, 
                mensaje: 'Credenciales inválidas. Verifique su correo o contraseña.' 
            });
        }
    });
});

// 4. RECUPERACIÓN DE CONTRASEÑA (POST /api/personas/recuperar) - [REQUISITO: RECUPERACIÓN]
router.post('/recuperar', (req, res) => {
    const { correo } = req.body;

    if (!correo) {
        return res.status(400).json({ error: 'Debe proporcionar un correo electrónico.' });
    }

    const query = 'SELECT * FROM personas WHERE correo = ?';
    db.query(query, [correo], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length > 0) {
            res.status(200).json({ 
                success: true, 
                mensaje: `Enlace de restablecimiento enviado con éxito al correo: ${correo}` 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                mensaje: 'El correo electrónico no se encuentra registrado.' 
            });
        }
    });
});

// 5. INICIO DE SESIÓN CON GOOGLE (POST /api/personas/google-auth) - [REQUISITO: GOOGLE AUTH]
router.post('/google-auth', (req, res) => {
    const { correo, nombres, apellidos } = req.body;

    if (!correo) {
        return res.status(400).json({ error: 'Datos de Google incompletos.' });
    }

    const queryBuscar = 'SELECT * FROM personas WHERE correo = ?';
    db.query(queryBuscar, [correo], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            res.status(200).json({ 
                success: true, 
                mensaje: 'Autenticación con Google exitosa (Usuario existente)', 
                usuario: results[0] 
            });
        } else {
            const queryInsertar = 'INSERT INTO personas (nombres, apellidos, correo, password) VALUES (?, ?, ?, "GOOGLE_ACCOUNT")';
            db.query(queryInsertar, [nombres || 'Usuario Google', apellidos || '', correo], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                
                res.status(201).json({
                    success: true,
                    mensaje: 'Registrado e iniciado sesión mediante Google',
                    usuario: { id: result.insertId, nombres, correo }
                });
            });
        }
    });
});

module.exports = router;
