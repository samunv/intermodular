<script>
  let productos = JSON.parse(sessionStorage.getItem("productos")) || [];
  let cargando = true;
  let activarFiltros = false;
  let valor = "";
  let filtroFabricante = ""; // Estado del filtro ("" para mostrar todos)
  let productosEliminados =
    JSON.parse(sessionStorage.getItem("productosEliminados")) || [];

  const cargarProductos = async () => {
    try {
      const response = await fetch("/productos.json");
      productos = await response.json();

      productos = productos.filter(
        (producto) => !productosEliminados.includes(producto.nombre_producto)
      );

      cargando = false;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      cargando = false;
    }
  };

  cargarProductos();

  const productosFiltrados = () => {
    return productos.filter((producto) => {
      const coincideBusqueda = producto.nombre_producto
        .toLowerCase()
        .includes(valor.toLowerCase());
      const coincideFabricante =
        filtroFabricante === "" || producto.fabricante === filtroFabricante;

      return coincideBusqueda && coincideFabricante;
    });
  };

  let ventanaActiva = false;
  let overlayActivo = false;

  let productoSeleccionado = null;
  let ventanaEliminarActiva = false;

  function mostrarInfo(producto) {
    productoSeleccionado = producto;
    overlayActivo = true;
    ventanaActiva = true;
  }

  function cerrarVentana() {
    ventanaActiva = false;
    ventanaEliminarActiva = false;
    overlayActivo = false;
    productoSeleccionado = null;
  }

  function activarVentanaEliminar(producto) {
    productoSeleccionado = producto;
    overlayActivo = true;
    ventanaEliminarActiva = true;
  }

  function eliminarProducto(producto) {
    alert("Se ha eliminado el producto: " + producto.nombre_producto);
    productosEliminados.push(producto.nombre_producto);
    sessionStorage.setItem(
      "productosEliminados",
      JSON.stringify(productosEliminados)
    );

    productos = productos.filter(
      (p) => p.nombre_producto !== producto.nombre_producto
    );

    window.location.reload();
  }

  function exportarProductosCSV() {
    const encabezados = [
      "ID",
      "Nombre del Producto",
      "Fabricante",
      "Cantidad",
      "País de Fabricación",
      "Precio Unitario",
    ];

    const filas = productos.map((producto) => [
      producto.ID,
      producto.nombre_producto,
      producto.fabricante,
      producto.cantidad,
      producto.pais_fabricacion,
      producto.precio_unitario,
    ]);

    const contenidoCSV = [encabezados, ...filas]
      .map((fila) => fila.join(","))
      .join("\n");

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
      placeholder={"Buscar " + filtroFabricante}
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
    {#each productosFiltrados() as producto}
      <div class="producto-card">
        <img src={producto.foto} alt={producto.nombre_producto} width="100" />
        <h3>{producto.nombre_producto}</h3>
        <p>Fabricante: {producto.fabricante}</p>
        <p>País: {producto.pais_fabricacion}</p>
        <p>Precio: ${producto.precio_unitario}</p>
        <!-- Contenedor de iconos -->
        <div class="iconos-productos">
          <!-- Icono para mostrar detalles -->
          <img
            src="/img/iconoinfo.png"
            alt="Detalles"
            on:click={() => mostrarInfo(producto)}
          />
          <!-- Icono para eliminar producto -->
          <img
            src="/img/eliminar.png"
            alt="Eliminar"
            on:click={() => activarVentanaEliminar(producto)}
          />
        </div>
      </div>
    {/each}
  {/if}
</div>

{#if ventanaActiva}
  <div id="detalle-producto">
    <h2>{productoSeleccionado.nombre_producto}</h2>
    <p>Fabricante: {productoSeleccionado.fabricante}</p>
    <p>Cantidad: {productoSeleccionado.cantidad}</p>
    <p>País: {productoSeleccionado.pais_fabricacion}</p>
    <p>Precio: ${productoSeleccionado.precio_unitario}</p>
    <button on:click={cerrarVentana}>Cerrar</button>
  </div>
{/if}

{#if ventanaEliminarActiva}
  <div id="confirmar-eliminacion">
    <h2>
      ¿Estás seguro de que quieres eliminar {productoSeleccionado.nombre_producto}
      del inventario?
    </h2>
    <div class="botones-eliminar-producto">
      <button on:click={() => eliminarProducto(productoSeleccionado)}>Eliminar</button
      >
      <button on:click={cerrarVentana}>Cancelar</button>
    </div>
  </div>
{/if}

<div
  id="overlay"
  class={overlayActivo ? "overlay-activo" : "o verlay-inactivo"}
></div>

<button class="btn-csv" on:click={exportarProductosCSV}
  ><img src="/img/archivo-excel.png" alt="" width="30" height="30" /></button
>
