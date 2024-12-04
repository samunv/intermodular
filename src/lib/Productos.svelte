<script>
  import "../css/global.css";
  import "../css/inventario.css";

  let productos = [];
  let cargando = true;
  let activarFiltros = false;
  let valor = "";
  let filtroFabricante = ""; // Estado del filtro ("" para mostrar todos)

  const cargarProductos = async () => {
    try {
      const response = await fetch("http://localhost:3070/productos");
      if (!response.ok) {
        throw new Error("Error al cargar los productos del servidor");
      }
      const datos = await response.json();

      productos = datos;
      cargando = false;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      cargando = false;
    }
  };

  cargarProductos();

  const productosFiltrados = () => {
    return productos.filter((producto) => {
      const coincideBusqueda = producto.nombre
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

  function mostrarInfo(producto) {
    productoSeleccionado = producto;
    overlayActivo = true;
    ventanaActiva = true;
  }

  function cerrarVentana() {
    ventanaActiva = false;
    overlayActivo = false;
    productoSeleccionado = null;
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
        <img src={producto.foto} alt={producto.nombre} width="100" />
        <h3>{producto.nombre}</h3>
        <p>Fabricante: {producto.fabricante}</p>
        <p>Stock: {producto.cantidad}</p>
        <p>Precio: ${producto.precio_unitario}</p>
        <!-- Contenedor de iconos -->
        <div class="iconos-productos">
          <!-- Icono para mostrar detalles -->
          <img
            src="/img/iconoinfo.png"
            alt="Detalles"
            on:click={() => mostrarInfo(producto)}
          />
        </div>
      </div>
    {/each}
  {/if}
</div>

{#if ventanaActiva}
  <div id="detalle-producto">
    <h2>{productoSeleccionado.nombre}</h2>
    <p>Fabricante: {productoSeleccionado.fabricante}</p>
    <p>Cantidad: {productoSeleccionado.cantidad}</p>
    <p>País: {productoSeleccionado.pais_fabricacion}</p>
    <p>Precio: ${productoSeleccionado.precio_unitario}</p>
    <button on:click={cerrarVentana}>Cerrar</button>
  </div>
{/if}

<div
  id="overlay"
  class={overlayActivo ? "overlay-activo" : "overlay-inactivo"}
></div>

<button class="btn-csv" on:click={exportarProductosCSV}
  ><img src="/img/archivo-excel.png" alt="" width="30" height="30" /></button
>
