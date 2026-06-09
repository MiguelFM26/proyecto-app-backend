const mysql = require('mysql2'); // Asegúrate de usar mysql2 para soportar MySQL 8+

const db = mysql.createConnection({
  host: 'mysql-1039d17b-killerexpert26-d18a.a.aivencloud.com',
  port: 11112,
  user: 'avnadmin',
  password: 'AVNS_Vbe8jeJJkm7I26scD7R',
  database: 'defaultdb',
  ssl: {
    rejectUnauthorized: false // Obligatorio para que Aiven acepte la conexión segura SSL
  }
});

db.connect((error) => {
    if (error) {
        console.error('❌ Error al conectar a la Base de Datos:', error.message);
        return;
    }
    console.log('✅ ¡Conectado exitosamente a la Base de Datos MySQL en XAMPP!');
});

// Exportamos la conexión para que los otros archivos puedan usarla
module.exports = db;