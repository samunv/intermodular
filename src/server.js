import express from "express";
import mysql from "mysql2/promise"; // Usamos la versión 'promise' para manejar las promesas

const app = express();

// Crear el pool de conexiones (usamos createPool para un mejor manejo de conexiones)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Añade tu contraseña si es necesario
  database: "bdintermodular",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware para parsear el cuerpo de la solicitud (express json)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Función para obtener clientes
const obtenerClientes = async () => {
  try {
    // Usamos db.query() para ejecutar la consulta
    const [clientes] = await db.query("SELECT * FROM clientes");
    return clientes;
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    throw error;
  }
};

const obtenerPedidos = async () => {
  try {
    const [pedidos] = await db.query("SELECT * FROM pedidos");
    return pedidos;
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    throw error;
  }
};


const obtenerProductos = async () => {
  try {
    const [productos] = await db.query("SELECT * FROM productos");
    return productos;
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    throw error;
  }
};

// Endpoint para obtener clientes
app.get("/clientes", async (req, res) => {
  try {
    const clientes = await obtenerClientes();
    res.json(clientes);
  } catch (error) {
    console.error("Error al manejar la solicitud:", error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});

// Endpoint para obtener pedidos
app.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await obtenerPedidos();
    res.json(pedidos);
  } catch (error) {
    console.error("Error al manejar la solicitud:", error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});

// Endpoint para obtener productos
app.get("/pedidos", async (req, res) => {
  try {
    const productos = await obtenerPedidos();
    res.json(productos);
  } catch (error) {
    console.error("Error al manejar la solicitud:", error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});

// Iniciar el servidor
app.listen(3050, () => {
  console.log("Backend listening on port http://localhost:3050");
});
