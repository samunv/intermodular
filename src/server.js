import express from "express";
import mysql from "mysql2/promise"; // Usamos la versión 'promise' para manejar las promesas
import cors from "cors";

const app = express();

// Configuración CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Permite solicitudes solo desde este origen
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
  })
);

// Crear el pool de conexiones (usamos createPool para un mejor manejo de conexiones)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
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
    const [clientes] = await db.query("SELECT * FROM clientes");
    return clientes;
  } catch (error) {
    console.error("Error al obtener los clientes:", error);

    throw error;
  }
};

const obtenerPedidos = async () => {
  try {
    const [pedidos] = await db.query(`
      SELECT p.*,
        c.nombre AS nombre_cliente,
        pr.nombre AS nombre_producto,
        p.forma_de_pago
      FROM 
        pedidos p
      JOIN 
        clientes c ON p.ID_cliente = c.ID
      JOIN 
        pedido_producto pp ON p.numero = pp.numero_pedido
      JOIN 
        productos pr ON pp.ID_producto = pr.ID
    `);
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
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

const actualizarCliente = async (id, pais, telefono) => {
  try {
    const actualizar = await db.query(`UPDATE clientes SET pais = ?, telefono= ? WHERE ID=?`, [
      pais,
      telefono,
      id
    ]);
    return actualizar;

  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

const eliminarDato = async (tabla, id) => {
  try {
    const columnasId = {
      clientes: "ID",
      productos: "ID",
      pedidos: "numero", // Ejemplo para 'pedidos'
    };

    const columnaId = columnasId[tabla];
    if (!columnaId) {
      return "Columna no encontrada";
    }

    const eliminar = await db.query(`DELETE FROM ?? WHERE ?? = ?`, [
      tabla,
      columnaId,
      id,
    ]);
    return eliminar;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
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
    res.status(500).json({
      error: "Error interno al obtener los clientes",
      detalle: error.message,
    });
  }
});

// Endpoint para obtener pedidos
app.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await obtenerPedidos();
    res.json(pedidos);
  } catch (error) {
    console.error("Error al manejar la solicitud:", error);
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
});

// Endpoint para obtener productos
app.get("/productos", async (req, res) => {
  try {
    const productos = await obtenerProductos();
    res.json(productos);
  } catch (error) {
    console.error("Error al manejar la solicitud:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Endpoint para eliminar clientes
app.get("/eliminar/:tabla/:id", async (req, res) => {
  try {
    const { tabla, id } = req.params;
    const eliminar = await eliminarDato(tabla, id);
    res.json(eliminar);
  } catch (error) {
    console.error("Error al manejar la solicitud:", error);
    res.status(500).json({
      error: "Error interno al obtener los clientes",
      detalle: error.message,
    });
  }
});

app.get(
  "/actualizar/clientes/:id/:pais/:telefono",
  async (req, res) => {
    try {
      const { id, pais, telefono } = req.params;
      const actualizar = await actualizarCliente(
        id,
        pais,
        telefono
      );
      res.json(actualizar);
    } catch (error) {
      console.error("Error al manejar la solicitud:", error);
      res.status(500).json({
        error: "Error interno al obtener los clientes",
        detalle: error.message,
      });
    }
  }
);

// Iniciar el servidor
app.listen(3070, () => {
  console.log("Backend listening on port http://localhost:3070");
});
