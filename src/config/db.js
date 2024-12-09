import mysql from 'mysql2/promise';

const db = mysql.createConnection({
  host: 'localhost', // Cambia según tu configuración
  user: 'root',
  password: '', // Añade tu contraseña si es necesario
  database: 'bdintermodular',
  waitForConnections: true,
  connectionLimit: 10, // Número máximo de conexiones en el pool
  queueLimit: 0, // Sin límite para las conexiones en cola
});

console.log('Conexión a la base de datos establecida.');

export default db;