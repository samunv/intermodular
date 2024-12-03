<script>
  let pedidos = JSON.parse(sessionStorage.getItem("pedidos")) || [];
  let cargando = true;
  let valor = "";
  let filtroTipo = ""; // Estado del filtro ("" para mostrar todos)
  let pedidosEliminados =
    JSON.parse(sessionStorage.getItem("pedidosEliminados")) || [];

  const cargarPedidos = async () => {
    try {
      const response = await fetch("/pedidos.json");
      pedidos = await response.json();

      pedidos = pedidos.filter(
        (pedido) => !pedidosEliminados.includes(pedido.numero_pedido)
      );

      cargando = false;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      cargando = false;
    }
  };

  cargarPedidos();

  const pedidosFiltrados = () => {
    return pedidos.filter((pedido) => {
      const coincideBusqueda = pedido.fecha_de_entrega
        .toLowerCase()
        .includes(valor.toLowerCase());
      const coincideTipo = filtroTipo === "" || pedido.tipo === filtroTipo;

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

  function eliminarPedido(pedido) {
    alert("Se ha eliminado el pedido número: " + pedido.numero_pedido);
    pedidosEliminados.push(pedido.numero_pedido);
    sessionStorage.setItem(
      "pedidosEliminados",
      JSON.stringify(pedidosEliminados)
    );

    pedidos = pedidos.filter((p) => p.numero_pedido !== pedido.numero_pedido);

    window.location.reload();
  }

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
      p.numero_pedido,
      p.fecha_de_entrega,
      p.fecha_de_compra,
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
        <p>Entrega: {pedido.fecha_de_entrega}</p>
        <div class="botones-card-pedidos">
          <button onclick={() => mostrarInfo(pedido)}
            ><img
              src="/img/iconoinfo.png"
              alt="Info"
              width="24"
              height="24"
            /></button
          >
          <button onclick={() => activarVentanaEliminar(pedido)}
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
    <p>Número de pedido: {pedidoSeleccionado.numero_pedido}</p>
    <p>Cliente: {pedidoSeleccionado.nombre_cliente}</p>
    <p>Producto: {pedidoSeleccionado.nombre_producto}</p>
    <p>Fecha de entrega: {pedidoSeleccionado.fecha_de_entrega}</p>
    <p>Forma de pago: {pedidoSeleccionado.forma_de_pago}</p>
    <button onclick={cerrarVentana}>Cerrar</button>
  {/if}
</div>

<div
  id="ventanaEliminar"
  style="display: {ventanaEliminarActiva ? 'block' : 'none'}"
>
  <h2>¿Estas seguro de que quieres eliminar el pedido?</h2>
  <div id="caja-botones">
    <button onclick={() => eliminarPedido(pedidoSeleccionado)}>Confirmar</button
    >
    <button onclick={cerrarVentana}>Cancelar</button>
  </div>
</div>

<div
  id="overlay"
  class={overlayActivo ? "overlay-activo" : "o verlay-inactivo"}
></div>

<button class="btn-csv" onclick={exportarPedidosCSV}
  ><img src="/img/archivo-excel.png" alt="" width="30" height="30" /></button
>
