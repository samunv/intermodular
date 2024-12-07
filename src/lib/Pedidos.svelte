<script>
  import "../css/global.css";
  import "../css/pedidos.css";

  import { onMount } from "svelte";

  let pedidos = [];
  let cargando = true;
  let valor = "";
  let filtroTipo = ""; // Estado del filtro ("" para mostrar todos)
  let ventanaCrearActiva = false;
  let ventanaEditarActiva = false;

  let ID_cliente = "";
  let ID_producto = "";
  let cantidad = 1; // Valor por defecto para evitar valores no válidos
  let fecha_compra = "";
  let fecha_entrega = "";
  let forma_de_pago = "";
  let precioUnitario = 0;
  let total = 0;

  let ventanaActiva = false;
  let overlayActivo = false;

  let pedidoSeleccionado = null;
  let ventanaEliminarActiva = false;

  const cargarPedidos = async () => {
    try {
      const response = await fetch("http://localhost:3080/pedidos"); // Fetch al endpoint
      if (!response.ok) {
        throw new Error("Error al obtener los pedidos");
      }
      const data = await response.json();

      pedidos = data;

      cargando = false;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      cargando = false;
    }
  };

  cargarPedidos();

  let clientes = []; // Aquí se almacenarán los clientes

  // Función para obtener clientes
  const obtenerClientes = async () => {
    try {
      const response = await fetch("http://localhost:3080/clientes");
      if (!response.ok) {
        throw new Error("Error al obtener los clientes");
      }
      return await response.json(); // Devuelve los clientes como array
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
      return [];
    }
  };

  let productos = [];
  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:3080/productos");
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      return await response.json(); // Devuelve los clientes como array
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
      return [];
    }
  };

  onMount(async () => {
    clientes = await obtenerClientes();
    productos = await obtenerProductos();
  });

  $: {
    // Buscamos el producto seleccionado en la lista de productos,
    // usando el ID seleccionado (ID_producto).
    const productoSeleccionado = productos.find((p) => p.ID === ID_producto);

    // Si se encuentra un producto, asignamos su precio_unitario a precioUnitario.
    // Si no se encuentra (por ejemplo, ID_producto está vacío), asignamos 0.
    precioUnitario = productoSeleccionado
      ? productoSeleccionado.precio_unitario
      : 0;

    // Calculamos el total multiplicando el precio unitario por la cantidad seleccionada.
    total = precioUnitario * cantidad;
  }

  function activarVentanaEditar(pedido) {
    pedidoSeleccionado = pedido;

    ventanaEditarActiva = true;
    overlayActivo = true;
  }
  const crearPedido = async () => {
    try {
      const response = await fetch(
        `http://localhost:3080/crear/pedidos/${ID_cliente}/${ID_producto}/${cantidad}/${fecha_compra}/${fecha_entrega}/${forma_de_pago}/${total}`
      );
      if (!response.ok)
        throw new Error(`Error al crear el pedido: ${response.statusText}`);
      await cargarPedidos();
      cerrarVentana();
      window.location.reload();
    } catch (error) {
      alert("Error al crear el pedido. Has seleccionado una cantidad mayor a la del stock existente del producto.")
      console.error("Error al crear el pedido:", error);
    }
  };

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

  function mostrarInfo(pedido) {
    pedidoSeleccionado = pedido;
    overlayActivo = true;
    ventanaActiva = true;
  }

  function cerrarVentana() {
    ventanaEditarActiva = false;
    ventanaActiva = false;
    ventanaEliminarActiva = false;
    overlayActivo = false;
    pedidoSeleccionado = null;
    ventanaCrearActiva = false;
    ID_cliente = "";
    ID_producto = "";
    cantidad = 1;
    fecha_compra = "";
    fecha_entrega = "";
    forma_de_pago = "";
  }

  function activarVentanaEliminar(pedido) {
    pedidoSeleccionado = pedido;
    overlayActivo = true;
    ventanaEliminarActiva = true;
  }
  function activarVentanaCrear() {
    ventanaCrearActiva = true;
    overlayActivo = true;
  }

  const eliminarPedido = async (pedido) => {
    try {
      const response = await fetch(
        "http://localhost:3080/eliminar/pedidos/" + pedido.numero_pedido
      );

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error al obtener los pedidos: ${response.statusText}`);
      }

      await cargarPedidos();
      cerrarVentana();
      window.location.reload();
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    } finally {
      cargando = false;
    }
  };
  function exportarPedidosCSV() {
    const encabezados = [
      "Número de pedido",
      "Fecha de entrega",
      "Fecha de compra",
      "Producto",
      "Cliente",
      "Forma de pago",
      "total"
    ];

    const filas = pedidos.map((p) => [
      p.numero,
      p.fecha_entrega,
      p.fecha_compra,
      p.nombre_producto,
      p.nombre_cliente,
      p.forma_de_pago,
      p.total
    ]);

    const contenidoCSV = [encabezados, ...filas]
      .map((fila) => fila.join(","))
      .join("\n");

    const blob = new Blob([contenidoCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pedidos.csv";
    a.click();

    URL.revokeObjectURL(url);
  }
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
