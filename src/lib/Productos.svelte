<script>
  // Importación de archivos CSS para el diseño de la página
  import "../css/global.css";
  import "../css/inventario.css";

  // Variables para el estado del inventario y la gestión de productos
  let productos = []; // Lista de productos
  let cargando = true; // Estado de carga de los productos
  let valor = ""; // Valor de búsqueda en el buscador
  let ventanaEliminarActiva = false; // Estado para controlar la ventana de eliminación de producto
  let ventanaCrearActiva = false; // Estado para controlar la ventana de creación de producto
  let ventanaEditarActiva = false; // Estado para controlar la ventana de edición de producto
  let overlayActivo = false; // Estado del overlay para bloquear la interfaz durante las ventanas modales

  let productoSeleccionado = null; // Producto seleccionado para edición o eliminación

  // Variables para los datos del nuevo producto a crear
  let nombre = "";
  let fabricante = "";
  let cantidad = "";
  let precio_unitario = "";
  let foto = "";

  // Función para cargar los productos desde el servidor
  const cargarProductos = async () => {
    try {
      // Hacemos una petición a la API para obtener los productos
      const response = await fetch("http://localhost:3080/productos");
      if (!response.ok) {
        throw new Error("Error al cargar los productos del servidor");
      }
      const datos = await response.json();

      // Almacenar los datos obtenidos en la variable productos y actualizar el estado de carga
      productos = datos;
      cargando = false;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      cargando = false;
    }
  };

  // Cargar productos al inicializar el componente
  cargarProductos();

  // Función para actualizar un producto
  const actualizarProducto = async (producto) => {
    // Validar si los campos de cantidad y precio son correctos
    if (!producto.cantidad || !producto.precio_unitario) {
      alert("Por favor, asegúrate de ingresar valores válidos.");
      return;
    }
    try {
      // Hacer una solicitud para actualizar los detalles del producto
      const response = await fetch(
        `http://localhost:3080/actualizar/stock/${producto.ID}/${producto.cantidad}/${producto.precio_unitario}`
      );
      if (!response.ok) {
        throw new Error(`Error al actualizar el producto: ${response.statusText}`);
      }
      // Recargar los productos y cerrar la ventana de edición
      await cargarProductos();
      cerrarVentana();
      window.location.reload();
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    } finally {
      cargando = false;
    }
  };

  // Función para eliminar un producto
  const eliminarProducto = async (productoSeleccionado) => {
    try {
      // Hacer una solicitud para eliminar el producto
      const response = await fetch(
        "http://localhost:3080/eliminar/productos/" + productoSeleccionado.ID
      );
      if (!response.ok) {
        throw new Error("Error al cargar los productos del servidor");
      }
      // Recargar los productos y cerrar la ventana de eliminación
      cerrarVentana();
      window.location.reload();
      cargando = false;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      cargando = false;
    }
  };

  // Función para crear un nuevo producto
  const crearProducto = async () => {
    console.log(nombre, fabricante, cantidad, precio_unitario, foto);
    try {
      // Hacer una solicitud para crear un nuevo producto
      const response = await fetch(
        "http://localhost:3080/crear/productos/" +
          nombre +
          "/" +
          fabricante +
          "/" +
          cantidad +
          "/" +
          precio_unitario +
          "/" +
          encodeURIComponent(foto)
      );
      if (!response.ok) {
        throw new Error("Error al cargar los productos del servidor");
      }
      // Recargar los productos y cerrar la ventana de creación
      cerrarVentana();
      window.location.reload();
      cargando = false;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      cargando = false;
    }
  };

  // Función para filtrar los productos basados en el valor de búsqueda
  const productosFiltrados = () => {
    return productos.filter((producto) => {
      // Filtra los productos cuyo nombre incluye el valor de búsqueda (en minúsculas)
      return producto.nombre.toLowerCase().includes(valor.toLowerCase());
    });
  };

  // Función para activar la ventana de edición de un producto
  function activarVentanaEditar(producto) {
    productoSeleccionado = producto;
    overlayActivo = true;
    ventanaEditarActiva = true;
  }

  // Función para cerrar cualquier ventana activa
  function cerrarVentana() {
    ventanaEditarActiva = false;
    ventanaEliminarActiva = false;
    ventanaCrearActiva = false;
    overlayActivo = false;
    productoSeleccionado = null;
    nombre = "";
    fabricante = "";
    cantidad = "";
    precio_unitario = "";
    foto = "";
  }

  // Función para activar la ventana de eliminación de un producto
  function activarVentanaEliminar(producto) {
    productoSeleccionado = producto;
    overlayActivo = true;
    ventanaEliminarActiva = true;
  }

  // Función para activar la ventana de creación de un nuevo producto
  function activarVentanaCrear() {
    ventanaCrearActiva = true;
    overlayActivo = true;
  }

  // Función para exportar los productos a un archivo CSV
  function exportarProductosCSV() {
    // Definir los encabezados del archivo CSV
    const encabezados = [
      "ID",
      "Nombre del Producto",
      "Fabricante",
      "Cantidad",
      "Precio Unitario",
    ];

    // Crear las filas de datos para el CSV
    const filas = productos.map((producto) => [
      producto.ID,
      producto.nombre,
      producto.fabricante,
      producto.cantidad,
      producto.precio_unitario,
    ]);

    // Crear el contenido CSV
    const contenidoCSV = [encabezados, ...filas]
      .map((fila) => fila.join(","))
      .join("\n");

    // Crear el archivo CSV y permitir la descarga
    const blob = new Blob([contenidoCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "productos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
</script>


<div id="buscador-filtros">
  <div id="contenedor-buscador">
    <img
      src="/img/search_24dp_CDCDCD_FILL0_wght400_GRAD0_opsz24.png"
      alt=""
      width="24"
      height="24"
    />
    <input
      type="text"
      bind:value={valor}
      placeholder="Buscar productos"
      id="buscador-input"
    />
  </div>
</div>

<div id="contenedor-principal">
  {#if cargando}
    <p>Cargando productos...</p>
  {:else if productosFiltrados().length === 0}
    <p>No se encontraron productos.</p>
  {:else}
    <div
      class="producto-card"
      id="card-crear-producto"
      on:click={activarVentanaCrear}
    >
      Crear nuevo producto <img
        src="/img/add_circle_24dp_WHITE_FILL0_wght400_GRAD0_opsz24.png"
        alt=""
      />
    </div>
    {#each productosFiltrados() as producto}
      <div class="producto-card">
        <img src={producto.foto} alt={producto.nombre} width="100" />
        <h3>{producto.nombre}</h3>
        <p>Fabricante: {producto.fabricante}</p>
        <p>Stock: {producto.cantidad}</p>
        <p>Precio: ${producto.precio_unitario}€/ud.</p>
        <!-- Contenedor de iconos -->
        <div class="iconos-productos">
          <!-- Icono para mostrar detalles -->
          <img
            src="/img/eliminar.png"
            alt="Eliminar"
            on:click={() => activarVentanaEliminar(producto)}
          />
          <img
            src="/img/iconoinfo.png"
            alt="Detalles"
            on:click={() => activarVentanaEditar(producto)}
          />
        </div>
      </div>
    {/each}
  {/if}
</div>

{#if ventanaEditarActiva}
  <div id="detalle-producto">
    <h2>{productoSeleccionado.nombre} - {productoSeleccionado.fabricante}</h2>
    
    <p>
      <label for="cantidad">Stock:</label><br />
      <input
        type="number"
        id="cantidad"
        bind:value={productoSeleccionado.cantidad}
        aria-label="Cantidad en stock"
      /> Uds.
    </p>
    <p>
      <label for="precio_unitario">Precio Unitario:</label><br />
      <input
        type="number"
        id="precio_unitario"
        bind:value={productoSeleccionado.precio_unitario}
        aria-label="Precio unitario"
      /> €
    </p>
    <div class="botones">
      <button on:click={cerrarVentana}>Cerrar</button>
      <button
        type="button"
        on:click={() => actualizarProducto(productoSeleccionado)}
        >Actualizar</button
      >
    </div>
  </div>
{/if}

{#if ventanaEliminarActiva}
  <div id="confirmar-eliminacion">
    <h2>¿Quieres eliminar {productoSeleccionado.nombre}?</h2>
    <div class="botones">
      <button on:click={() => eliminarProducto(productoSeleccionado)}
        >Eliminar</button
      >
      <button on:click={cerrarVentana}>Cerrar</button>
    </div>
  </div>
{/if}

{#if ventanaCrearActiva}
  <div id="ventana-crear-producto">
    <h2>Crear nuevo producto</h2>

    <label for="nombre">Nombre:</label>
    <input
      type="text"
      id="nombre"
      bind:value={nombre}
      placeholder="Nombre del producto"
      required
    />

    <label for="fabricante">Fabricante:</label>
    <input
      type="text"
      id="fabricante"
      bind:value={fabricante}
      placeholder="Fabricante del producto"
      required
    />

    <label for="cantidad">Cantidad:</label>
    <input
      type="number"
      id="cantidad"
      bind:value={cantidad}
      min="0"
      placeholder="Cantidad disponible"
      required
    />

    <label for="precio">Precio Unitario:</label>
    <input
      type="number"
      id="precio"
      bind:value={precio_unitario}
      step="0.01"
      min="0"
      placeholder="Precio por unidad"
      required
    />

    <label for="foto">Foto (URL):</label>
    <input
      type="text"
      id="foto"
      bind:value={foto}
      placeholder="URL de la imagen"
      required
    />

    <div class="botones">
      <!-- Aquí se valida el formulario antes de crear el producto -->
      <button
        type="button"
        on:click={() => {
          if (nombre && fabricante && cantidad && precio_unitario && foto) {
            crearProducto();
          } else {
            alert("Por favor, completa todos los campos requeridos.");
          }
        }}
      >
        Crear
      </button>
      <button type="button" on:click={cerrarVentana}>Cancelar</button>
    </div>
  </div>
{/if}

<div
  id="overlay"
  class={overlayActivo ? "overlay-activo" : "overlay-inactivo"}
></div>

<button class="btn-csv" on:click={exportarProductosCSV}
  ><img src="/img/archivo-excel.png" alt="" width="30" height="30" /></button
> 
