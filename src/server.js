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
      SELECT 
  p.numero AS numero_pedido,
  c.nombre AS nombre_cliente,
  pr.nombre AS nombre_producto,
  p.cantidad,
  p.fecha_compra,
  p.fecha_entrega,
  p.forma_de_pago
FROM pedidos p
JOIN clientes c ON p.ID_cliente = c.ID
JOIN productos pr ON p.ID_producto = pr.ID;
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
    const actualizar = await db.query(
      `UPDATE clientes SET pais = ?, telefono= ? WHERE ID=?`,
      [pais, telefono, id]
    );
    return actualizar;
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    throw error;
  }
};
const actualizarProducto = async (id, cantidad, precio_unitario) => {
  try {
    const actualizar = await db.query(
      `UPDATE productos SET cantidad = ?, precio_unitario= ? WHERE ID=?`,
      [cantidad, precio_unitario, id]
    );
    return actualizar;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

const actualizarStock = async (id, cantidad) => {
  try {
    const actualizar = await db.query(
      `UPDATE productos SET cantidad = ? WHERE ID=?`,
      [cantidad, id]
    );
    return actualizar;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

const actualizarPedidos = async (numero, cantidad) => {
  try {
    const actualizar = await db.query(
      `UPDATE pedidos SET cantidad = ?  WHERE numero=?`,
      [cantidad, numero]
    );
    return actualizar;
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    throw error;
  }
};

const crearCliente = async (nombre, pais, entidad, telefono) => {
  try {
    await db.query(
      `INSERT INTO clientes(nombre, pais, entidad, telefono) VALUES(?, ?, ?, ?)`,
      [nombre, pais, entidad, telefono]
    );
    return "Cliente creado exitosamente";
  } catch (error) {
    console.error("Error al crear cliente:", error);
    throw error;
  }
};

const crearPedido = async (
  ID_cliente,
  ID_producto,
  cantidad,
  fecha_compra,
  fecha_entrega,
  forma_de_pago
) => {
  try {
    // Verificar stock disponible
    const [producto] = await db.query("SELECT cantidad FROM productos WHERE ID = ?", [ID_producto]);

    const stockDisponible = producto[0].cantidad;
    console.log(producto);

    if (stockDisponible < cantidad) {
      throw new Error("Stock insuficiente para el producto solicitado");
    }

    // Crear el pedido
    await db.query(
      `INSERT INTO pedidos (ID_cliente, ID_producto, cantidad, fecha_compra, fecha_entrega, forma_de_pago)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        ID_cliente,
        ID_producto,
        cantidad,
        fecha_compra,
        fecha_entrega,
        forma_de_pago,
      ]
    );

    // Actualizar el stock
    const nuevoStock = stockDisponible - cantidad;
    await db.query(
      "UPDATE productos SET cantidad = ? WHERE ID = ?",
      [nuevoStock, ID_producto]
    );

    return { mensaje: "Pedido creado exitosamente y stock actualizado" };
  } catch (error) {
    console.error("Error al crear pedido:", error);
    throw new Error("Error al crear el pedido en la base de datos");
  }
};

const crearProducto = async (
  nombre,
  fabricante,
  cantidad,
  precio_unitario,
  foto
) => {
  try {
    await db.query(
      `INSERT INTO productos(nombre, fabricante, cantidad, precio_unitario, foto) VALUES(?, ?, ?, ?, ?)`,
      [nombre, fabricante, cantidad, precio_unitario, foto]
    );
    return "Producto creado exitosamente";
  } catch (error) {
    console.error("Error al crear producto:", error);
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
      error: "Error interno al eliminar un registro.",
      detalle: error.message,
    });
  }
});

app.get("/actualizar/clientes/:id/:pais/:telefono", async (req, res) => {
  try {
    const { id, pais, telefono } = req.params;
    const actualizar = await actualizarCliente(id, pais, telefono);
    res.json(actualizar);
  } catch (error) {
    console.error("Error al manejar la solicitud:", error);
    res.status(500).json({
      error: "Error interno al obtener los clientes",
      detalle: error.message,
    });
  }
});

app.get(
  "/crear/clientes/:nombre/:pais/:entidad/:telefono",
  async (req, res) => {
    try {
      const { nombre, pais, entidad, telefono } = req.params;
      const crear = await crearCliente(nombre, pais, entidad, telefono);
      res.json(crear);
    } catch (error) {
      console.error("Error al manejar la solicitud:", error);
      res.status(500).json({
        error: "Error interno al obtener los clientes",
        detalle: error.message,
      });
    }
  }
);
app.get(
  "/crear/pedidos/:ID_cliente/:ID_producto/:cantidad/:fecha_compra/:fecha_entrega/:forma_de_pago",
  async (req, res) => {
    try {
      const {
        ID_cliente,
        ID_producto,
        cantidad,
        fecha_compra,
        fecha_entrega,
        forma_de_pago,
      } = req.params;
      const crear = await crearPedido(
        ID_cliente,
        ID_producto,
        cantidad,
        fecha_compra,
        fecha_entrega,
        forma_de_pago
      );
      res.json(crear);
    } catch (error) {
      console.error("Error al manejar la solicitud:", error);
      res.status(500).json({
        error: "Error interno al crear el pedido",
        detalle: error.message,
      });
    }
  }
);

app.get(
  "/crear/productos/:nombre/:fabricante/:cantidad/:precio_unitario/:foto",
  async (req, res) => {
    try {
      const { nombre, fabricante, cantidad, precio_unitario, foto } =
        req.params;
      const crear = await crearProducto(
        nombre,
        fabricante,
        cantidad,
        precio_unitario,
        foto
      );
      res.json(crear);
    } catch (error) {
      console.error("Error al manejar la solicitud:", error);
      res.status(500).json({
        error: "Error interno al obtener los productos",
        detalle: error.message,
      });
    }
  }
);
app.get(
  "/actualizar/stock/:id/:cantidad/:precio_unitario",
  async (req, res) => {
    try {
      const { id, cantidad, precio_unitario } = req.params;
      const actualizar = await actualizarProducto(
        id,
        cantidad,
        precio_unitario
      );
      res.json(actualizar);
    } catch (error) {
      console.error("Error al manejar la solicitud:", error);
      res.status(500).json({
        error: "Error interno al obtener los productos ",
        detalle: error.message,
      });
    }
  }
);

app.get("/actualizar/productos/:id/:cantidad", async (req, res) => {
  try {
    const { id, cantidad } = req.params;
    const actualizar = await actualizarStock(id, cantidad);
    res.json(actualizar);
  } catch (error) {
    console.error("Error al manejar la solicitud:", error);
    res.status(500).json({
      error: "Error interno al obtener los productos ",
      detalle: error.message,
    });
  }
});
app.put("/actualizar/pedidos/:numero/:cantidad", async (req, res) => {
  const { numero, cantidad } = req.params;
  try {
    const result = await actualizarPedidos(numero, cantidad);
    res.json({ mensaje: "Pedido actualizado", result });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    res.status(500).json({ error: "Error al actualizar el pedido" });
  }
});



// Iniciar el servidor
app.listen(3080, () => {
  console.log("Backend listening on port http://localhost:3080");
});

