<script>
  import "../css/global.css";
  import "../css/pedidos.css";

  let pedidos = [];
  let cargando = true;
  let valor = "";
  let filtroTipo = ""; // Estado del filtro ("" para mostrar todos)

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

  let ventanaActiva = false;
  let overlayActivo = false;

  let pedidoSeleccionado = null;
  let ventanaEliminarActiva = false;

  function mostrarInfo(pedido) {
    pedidoSeleccionado = pedido;
    overlayActivo = true;
    ventanaActiva = true;
  }

  function cerrarVentana() {
    ventanaActiva = false;
    ventanaEliminarActiva = false;
    overlayActivo = false;
    pedidoSeleccionado = null;
  }

  function activarVentanaEliminar(pedido) {
    pedidoSeleccionado = pedido;
    overlayActivo = true;
    ventanaEliminarActiva = true;
  }

  const eliminarPedido = async (pedido) => {
    try {
      const response = await fetch(

        "http://localhost:3070/eliminar/pedidos/" + pedido.numero_pedido

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
    ];

    const filas = pedidos.map((p) => [
      p.numero,
      p.fecha_entrega,
      p.fecha_compra,
      p.nombre_producto,
      p.nombre_cliente,
      p.forma_de_pago,
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
    {#each pedidosFiltrados() as pedido}
      <div class="pedido-card">
        <h3>{pedido.nombre_cliente}</h3>
        <p>Producto: {pedido.nombre_producto}</p>
        <p>Entrega: {pedido.fecha_entrega}</p>
        <div class="botones-card-pedidos">
          <button on:click={() => mostrarInfo(pedido)}
            ><img
              src="/img/iconoinfo.png"
              alt="Info"
              width="24"
              height="24"
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

<div id="ventana" style="display: {ventanaActiva ? 'block' : 'none'}">
  <h3>Detalles del Pedido</h3>
  {#if pedidoSeleccionado}
    <p>Número de pedido: {pedidoSeleccionado.numero}</p>
    <p>Cliente: {pedidoSeleccionado.nombre_cliente}</p>
    <p>Producto: {pedidoSeleccionado.nombre_producto}</p>
    <p>Cantidad: {pedidoSeleccionado.cantidad}</p>
    <p>Fecha de entrega: {pedidoSeleccionado.fecha_entrega}</p>
    <p>Forma de pago: {pedidoSeleccionado.forma_de_pago}</p>
    <button on:click={cerrarVentana}>Cerrar</button>
  {/if}
</div>

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

<button class="btn-csv" on:click={exportarPedidosCSV}
  ><img src="/img/archivo-excel.png" alt="" width="30" height="30" /></button
>
