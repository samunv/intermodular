const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',        
  user: 'root',             
  password: '',    
  database: 'bdintermodular'
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
