const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',        // O tu host de MySQL
  user: 'root',             // Usuario de la base de datos
  password: '',     // Contraseña de la base de datos
  database: 'bdintermodular' // Nombre de la base de datos
});

// Verificación de la conexión
db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = db;  // Exportamos la conexión para usarla en otros archivos
