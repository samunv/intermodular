<script>
  let clientes = JSON.parse(sessionStorage.getItem("clientes")) || [];
  let cargando = true;
  let activarFiltros = false;
  let valor = "";
  let filtroTipo = ""; // Estado del filtro ("" para mostrar todos)
  let clientesEliminados =
    JSON.parse(sessionStorage.getItem("clientesEliminados")) || [];

  const cargarClientes = async () => {
    try {
      const response = await fetch("/clientes.json");
      clientes = await response.json();

      clientes = clientes.filter(
        (cliente) => !clientesEliminados.includes(cliente.nombre)
      );

      cargando = false;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      cargando = false;
    }
  };

  cargarClientes();

  const clientesFiltrados = () => {
    return clientes.filter((cliente) => {
      const coincideBusqueda = cliente.nombre
        .toLowerCase()
        .includes(valor.toLowerCase());
      const coincideTipo = filtroTipo === "" || cliente.tipo === filtroTipo; // Filtrar por tipo si hay filtro seleccionado

      return coincideBusqueda && coincideTipo;
    });
  };

  let ventanaActiva = false;
  let overlayActivo = false;

  let clienteSeleccionado = null;
  let ventanaEliminarActiva = false;

  function mostrarInfo(cliente) {
    clienteSeleccionado = cliente;
    overlayActivo = true;
    ventanaActiva = true;
  }

  function cerrarVentana() {
    ventanaActiva = false;
    ventanaEliminarActiva = false;
    overlayActivo = false;
    clienteSeleccionado = null;
  }

  function activarVentanaEliminar(cliente) {
    clienteSeleccionado = cliente;
    overlayActivo = true;
    ventanaEliminarActiva = true;
  }

  function eliminarCliente(cliente) {
    alert("Se ha eliminado el cliente: " + cliente.nombre);
    clientesEliminados.push(cliente.nombre);
    sessionStorage.setItem(
      "clientesEliminados",
      JSON.stringify(clientesEliminados)
    );

    clientes = clientes.filter((c) => c.nombre !== cliente.nombre);

    window.location.reload();
  }

  function exportarClientesCSV() {
    // Definir los encabezados del archivo CSV
    const encabezados = ["Nombre", "Entidad", "País", "Teléfono"];

    // Crear el contenido del CSV
    const filas = clientes.map((cliente) => [
      cliente.nombre,
      cliente.tipo,
      cliente.pais,
      cliente.telefono,
    ]);

    // Convertir a texto CSV
    const contenidoCSV = [encabezados, ...filas]
      .map((fila) => fila.join(",")) // Unir cada fila con comas
      .join("\n"); // Unir las filas con saltos de línea

    // Crear un archivo Blob con el contenido del CSV
    const blob = new Blob([contenidoCSV], { type: "text/csv" });

    // Crear un enlace de descarga
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes-proyecto-svelte.csv"; // Nombre del archivo
    a.click();

    // Liberar memoria asociada al objeto URL
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
      placeholder={"Buscar " + filtroTipo}
      id="buscador-input"
    />
    <img
      src="/img/tune_24dp_CDCDCD_FILL0_wght400_GRAD0_opsz24.png"
      on:click={() => (activarFiltros = !activarFiltros)}
      alt="Filtros"
      width="24"
      height="24"
      id="icono-filtrar"
    />
  </div>

  {#if activarFiltros}
    <div id="contenedor-filtros">
      <!-- Botones para filtrar por tipo -->
      <div
        class="filtros"
        id="filtro-compañia"
        on:click={() => (filtroTipo = "compañía")}
      >
        Compañías
      </div>
      <div
        class="filtros"
        id="filtro-individual"
        on:click={() => (filtroTipo = "individual")}
      >
        Individuales
      </div>
      <div class="filtros" id="filtro-todos" on:click={() => (filtroTipo = "")}>
        Todos
      </div>
    </div>

    <div id="contenedor-filtros-movil">
      <!-- Botones para filtrar por tipo -->
      <div
        class="filtros"
        id="filtro-compañia"
        on:click={() => (filtroTipo = "compañía")}
      >
        Compañías
      </div>
      <div
        class="filtros"
        id="filtro-individual"
        on:click={() => (filtroTipo = "individual")}
      >
        Individuales
      </div>
      <div class="filtros" id="filtro-todos" on:click={() => (filtroTipo = "")}>
        Todos
      </div>
    </div>
  {/if}
</div>



<div id="contenedor-principal">
  {#if cargando}
    <p>Cargando clientes...</p>
    <!-- Mensaje mientras se cargan los datos -->
  {:else if clientesFiltrados().length === 0}
    <p>No se encontraron clientes.</p>
    <!-- Mensaje cuando no hay clientes -->
  {:else}
    {#each clientesFiltrados() as cliente}
      <div id="card" class="cards">
        <div class="foto-texto" on:click={() => mostrarInfo(cliente)}>
          <img src={cliente.foto} alt="" width="54" height="54" />
          <div class="texto">
            <h3 class="nombre">{cliente.nombre}</h3>
            <p class="direccion">{cliente.pais}</p>
          </div>
        </div>

        <div class="iconos">
          <img
            src="/img/eliminar.png"
            alt="Eliminar"
            on:click={() => activarVentanaEliminar(cliente)}
          />
        </div>
      </div>
    {/each}
  {/if}
</div>

<!-- Ventana que muestra la información del cliente -->
{#if ventanaActiva}
  <div id="ventana" class="activo">
    <img src={clienteSeleccionado.foto} alt="" width="60" height="60" />
    <p>Nombre: {clienteSeleccionado.nombre}</p>
    <p>Entidad: {clienteSeleccionado.tipo}</p>
    <p>País: {clienteSeleccionado.pais}</p>
    <p>Teléfono: {clienteSeleccionado.telefono}</p>
    <button on:click={cerrarVentana}>Cerrar Ventana</button>
  </div>
{/if}

{#if ventanaEliminarActiva}
  <div id="ventanaEliminar">
    <h2>
      ¿Estás seguro de que quieres eliminar a {clienteSeleccionado.nombre}?
    </h2>
    <div id="caja-botones">
      <button
        id="btn-eliminar"
        on:click={() => eliminarCliente(clienteSeleccionado)}>Eliminar</button
      >
      <button id="btn-cerrar" on:click={cerrarVentana}>Cerrar</button>
    </div>
  </div>
{/if}

<div
  id="overlay"
  class={overlayActivo ? "overlay-activo" : "o verlay-inactivo"}
></div>

<button class="btn-csv" on:click={exportarClientesCSV}><img src="/img/archivo-excel.png" alt="" width="30" height="30"></button>