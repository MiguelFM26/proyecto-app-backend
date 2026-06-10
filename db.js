const mysql = require('mysql2'); // Asegúrate de usar mysql2 para soportar MySQL 8+

const db = mysql.createConnection({
  host: 'mysql-1039d17b-killerexpert26-d18a.e.aivencloud.com', // ✅ ¡Corregido con la 'e'!
  port: 11112,
  user: 'avnadmin',
  password: 'AVNS_Vbe8jeJJkm7I26scD7R',
  database: 'defaultdb', // ✅ Corregido de 'defaultdh' a 'defaultdb'
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((error) => {
    if (error) {
        console.error('❌ Error al conectar a la Base de Datos:', error.message);
        return;
    }
    console.log('✅ ¡Conectado exitosamente a la Base de Datos MySQL en la Nube!');
});

// Exportamos la conexión para que los otros archivos puedan usarla
module.exports = db;
