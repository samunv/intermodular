<script>
  // Importación de hojas de estilo
  import "../css/global.css"; // Estilos globales
  import "../css/pedidos.css"; // Estilos específicos de pedidos

  // Importación de funciones reactivas de Svelte
  import { onMount } from "svelte";

  /*** Variables de estado ***/

  // Lista de pedidos obtenidos del servidor
  let pedidos = [];

  // Indicador de carga inicial
  let cargando = true;

  // Variables para búsqueda y filtrado
  let valor = ""; // Valor de búsqueda
  let filtroTipo = ""; // Filtro de tipo de pedido

  // Estado del overlay y ventanas modales
  let overlayActivo = false;
  let ventanaCrearActiva = false;
  let ventanaEditarActiva = false;
  let ventanaEliminarActiva = false;

  // Datos para crear o editar un pedido
  let ID_cliente = ""; // ID del cliente seleccionado
  let ID_producto = ""; // ID del producto seleccionado
  let cantidad = 1; // Cantidad del pedido
  let fecha_compra = ""; // Fecha de compra
  let fecha_entrega = ""; // Fecha de entrega
  let forma_de_pago = ""; // Método de pago
  let precioUnitario = 0; // Precio unitario del producto
  let total = 0; // Total calculado del pedido

  // Pedido seleccionado para edición o eliminación
  let pedidoSeleccionado = null;

  // Listas de datos externos
  let clientes = []; // Lista de clientes obtenidos del servidor
  let productos = []; // Lista de productos obtenidos del servidor

  /*** Funciones Asíncronas (CRUD) ***/

  // Cargar pedidos desde el servidor
  const cargarPedidos = async () => {
    try {
      const response = await fetch("http://localhost:3080/pedidos");
      if (!response.ok) throw new Error("Error al obtener los pedidos");
      pedidos = await response.json(); // Guardar pedidos obtenidos
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    } finally {
      cargando = false; // Desactivar indicador de carga
    }
  };

  // Obtener la lista de clientes desde el servidor
  const obtenerClientes = async () => {
    try {
      const response = await fetch("http://localhost:3080/clientes");
      if (!response.ok) throw new Error("Error al obtener los clientes");
      return await response.json(); // Devolver lista de clientes
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
      return [];
    }
  };

  // Obtener la lista de productos desde el servidor
  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:3080/productos");
      if (!response.ok) throw new Error("Error al obtener los productos");
      return await response.json(); // Devolver lista de productos
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      return [];
    }
  };

  // Crear un nuevo pedido y recargar la lista
  const crearPedido = async () => {
    try {
      const url = `http://localhost:3080/crear/pedidos/${ID_cliente}/${ID_producto}/${cantidad}/${fecha_compra}/${fecha_entrega}/${forma_de_pago}/${total}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al crear el pedido");

      await cargarPedidos(); // Recargar lista de pedidos
      cerrarVentana(); // Cerrar ventanas modales
    } catch (error) {
      alert("Error al crear el pedido. Revisa los datos.");
      console.error("Error al crear el pedido:", error);
    }
  };

  // Eliminar un pedido existente y recargar la lista
  const eliminarPedido = async (pedido) => {
    try {
      const url = `http://localhost:3080/eliminar/pedidos/${pedido.numero_pedido}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al eliminar el pedido");

      await cargarPedidos(); // Recargar lista de pedidos
      cerrarVentana(); // Cerrar ventanas modales
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  /*** Lógica Reactiva ***/

  // Calcular el precio unitario y total del pedido seleccionado
  $: {
    const productoSeleccionado = productos.find((p) => p.ID === ID_producto);
    precioUnitario = productoSeleccionado
      ? productoSeleccionado.precio_unitario
      : 0;
    total = precioUnitario * cantidad; // Calcular total
  }

  /*** Control de Ventanas Modales ***/

  // Abrir ventana de creación de pedidos
  function activarVentanaCrear() {
    ventanaCrearActiva = true;
    overlayActivo = true; // Activar overlay
  }

  // Abrir ventana de edición con el pedido seleccionado
  function activarVentanaEditar(pedido) {
    pedidoSeleccionado = pedido;
    ventanaEditarActiva = true;
    overlayActivo = true; // Activar overlay
  }

  // Abrir ventana de confirmación de eliminación
  function activarVentanaEliminar(pedido) {
    pedidoSeleccionado = pedido;
    ventanaEliminarActiva = true;
    overlayActivo = true; // Activar overlay
  }

  // Cerrar todas las ventanas modales y restablecer datos
  function cerrarVentana() {
    ventanaCrearActiva = false;
    ventanaEditarActiva = false;
    ventanaEliminarActiva = false;
    overlayActivo = false;

    // Restablecer valores de formulario
    pedidoSeleccionado = null;
    ID_cliente = "";
    ID_producto = "";
    cantidad = 1;
    fecha_compra = "";
    fecha_entrega = "";
    forma_de_pago = "";
  }

  // Mostrar información detallada del pedido en una ventana modal
  function mostrarInfo(pedido) {
    pedidoSeleccionado = pedido; // Guardar pedido seleccionado
    ventanaEditarActiva = true; // Activar ventana de detalles
    overlayActivo = true; // Activar overlay
  }

  /*** Funciones de Utilidad ***/

  // Filtrar pedidos por búsqueda y tipo
  const pedidosFiltrados = () => {
    return pedidos.filter((pedido) => {
      const coincideBusqueda = pedido.fecha_entrega
        .toLowerCase()
        .includes(valor.toLowerCase());
      const coincideTipo =
        filtroTipo === "" || pedido.fecha_entrega === filtroTipo;
      return coincideBusqueda && coincideTipo;
    });
  };

  // Exportar la lista de pedidos a un archivo CSV
  const exportarPedidosCSV = () => {
    const encabezados = [
      "Número de pedido",
      "Fecha de entrega",
      "Fecha de compra",
      "Producto",
      "Cliente",
      "Forma de pago",
      "Total",
    ];

    const filas = pedidos.map((p) => [
      p.numero_pedido,
      p.fecha_entrega,
      p.fecha_compra,
      p.nombre_producto,
      p.nombre_cliente,
      p.forma_de_pago,
      p.total,
    ]);

    // Crear archivo CSV
    const contenidoCSV = [encabezados, ...filas]
      .map((fila) => fila.join(","))
      .join("\n");

    // Crear y descargar archivo CSV
    const blob = new Blob([contenidoCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pedidos.csv";
    a.click();
    URL.revokeObjectURL(url); // Liberar URL temporal
  };

  // Cargar datos iniciales al montar el componente
  onMount(async () => {
    clientes = await obtenerClientes(); // Cargar clientes
    productos = await obtenerProductos(); // Cargar productos
    await cargarPedidos(); // Cargar pedidos
  });
</script>

<div id="buscador-filtros">
  <div id="contenedor-buscador">
    <img
      src="/img/search_24dp_CDCDCD_FILL0_wght400_GRAD0_opsz24.png"
      alt="Buscar"
      width="24"
      height="24"
    />
    <input
      type="text"
      bind:value={valor}
      placeholder="Buscar por fecha de entrega"
      id="buscador-input"
    />
  </div>
</div>

<div id="contenedor-principal-pedidos">
  {#if cargando}
    <p>Cargando pedidos...</p>
  {:else if pedidosFiltrados().length === 0}
    <p>No se encontraron pedidos.</p>
  {:else}
    <div class="pedido-card" id="crear-pedido" on:click={activarVentanaCrear}>
      Crear nuevo pedido<img
        src="/img/add_circle_24dp_WHITE_FILL0_wght400_GRAD0_opsz24.png"
        alt=""
        width="24"
        height="24"
      />
    </div>
    {#each pedidosFiltrados() as pedido}
      <div class="pedido-card">
        <h3>{pedido.nombre_cliente}</h3>
        <p>Producto: {pedido.nombre_producto}</p>
        <p>x {pedido.cantidad} uds.</p>
        <p>Entrega: {pedido.fecha_entrega}</p>
        <div class="botones-card-pedidos">
          <button on:click={() => mostrarInfo(pedido)}
            ><img
              src="/img/iconoinfo.png"
              alt="Detalles"
              width="24"
              height="24"
              on:click={() => activarVentanaEditar(pedido)}
            /></button
          >
          <button on:click={() => activarVentanaEliminar(pedido)}
            ><img
              src="/img/eliminar.png"
              alt="Eliminar"
              width="24"
              height="24"
            /></button
          >
        </div>
      </div>
    {/each}
  {/if}
</div>
{#if ventanaEditarActiva}
  <div id="detalle-pedido">
    <h2>Número de pedido: {pedidoSeleccionado.numero_pedido}</h2>
    <p>Cliente: {pedidoSeleccionado.nombre_cliente}</p>
    <p>Producto pedido: {pedidoSeleccionado.nombre_producto}</p>
    <p>Cantidad pedida: {pedidoSeleccionado.cantidad}</p>
    <p>Fecha de compra: {pedidoSeleccionado.fecha_compra}</p>
    <p>Fecha de entrega: {pedidoSeleccionado.fecha_entrega}</p>
    <p>Forma de pago: {pedidoSeleccionado.forma_de_pago}</p>
    <p>Total: {pedidoSeleccionado.total}€</p>

    <button on:click={cerrarVentana}>Cerrar</button>
  </div>
{/if}
<div
  id="ventanaEliminar"
  style="display: {ventanaEliminarActiva ? 'block' : 'none'}"
>
  <h2>¿Estas seguro de que quieres eliminar el pedido?</h2>
  <div id="caja-botones">
    <button on:click={() => eliminarPedido(pedidoSeleccionado)}
      >Confirmar</button
    >
    <button on:click={cerrarVentana}>Cancelar</button>
  </div>
</div>

<div
  id="overlay"
  class={overlayActivo ? "overlay-activo" : "overlay-inactivo"}
></div>

{#if ventanaCrearActiva}
  <div id="ventana-crear-pedido">
    <h2>Crear nuevo Pedido</h2>

    <div class="seccion-columnas">
      <div class="columnas">
        <label for="ID_cliente">Cliente:</label>
        <select id="ID_cliente" bind:value={ID_cliente} required>
          {#each clientes as cliente}
            <option value={cliente.ID}>{cliente.nombre}</option>
          {/each}
        </select>
        <br />

        <label for="ID_producto">Producto:</label>
        <select id="ID_producto" bind:value={ID_producto} required>
          {#each productos as producto}
            <option value={producto.ID}>{producto.nombre}</option>
          {/each}
        </select>
        <br />

        <label for="cantidad">Cantidad:</label>
        <input
          type="number"
          id="cantidad"
          bind:value={cantidad}
          min="1"
          required
        />
        <br />
      </div>
      <div class="columnas">
        <label for="fecha_compra">Fecha de Compra:</label>
        <input
          type="date"
          id="fecha_compra"
          bind:value={fecha_compra}
          required
        />
        <br />

        <label for="fecha_entrega">Fecha de Entrega:</label>
        <input
          type="date"
          id="fecha_entrega"
          bind:value={fecha_entrega}
          required
        />
        <br />

        <label for="forma_de_pago">Forma de Pago:</label>
        <select id="forma_de_pago" bind:value={forma_de_pago} required>
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta de crédito">Tarjeta de crédito</option>
        </select>
        <br />
      </div>
    </div>
    <div class="precios">
      <p>Precio unitario: {precioUnitario} €</p>
      <p>Precio Total: {total.toFixed(2)} €</p>
    </div>

    <div class="botones">
      <button on:click={cerrarVentana}>Cancelar</button>
      <button on:click={crearPedido}>Crear</button>
    </div>
  </div>
{/if}

<button class="btn-csv" on:click={exportarPedidosCSV}
  ><img src="/img/archivo-excel.png" alt="" width="30" height="30" /></button
>
