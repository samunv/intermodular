<script>
  import "../css/clientes.css";
  import "../css/global.css";
  
  let clientes = [];
  let cargando = true;
  let activarFiltros = false;
  let valor = "";
  let filtroTipo = ""; // Estado del filtro ("" para mostrar todos)
  let ventanaActiva = false;
  let overlayActivo = false;
  let clienteSeleccionado = null;
  let ventanaEliminarActiva = false;
  let ventanaEditarActiva = false;

  // Función para cargar los clientes desde el endpoint
  const cargarClientes = async () => {
    try {
      const response = await fetch("http://localhost:3070/clientes");

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(
          `Error al obtener los clientes: ${response.statusText}`
        );
      }

      // Asignar los datos obtenidos a la variable clientes
      clientes = await response.json();
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    } finally {
      cargando = false;
    }
  };

  // Filtrar clientes en base al buscador y tipo
  const clientesFiltrados = () => {
    return clientes.filter((cliente) => {
      const coincideBusqueda = cliente.nombre
        .toLowerCase()
        .includes(valor.toLowerCase());
      const coincideTipo = filtroTipo === "" || cliente.entidad === filtroTipo;
      return coincideBusqueda && coincideTipo;
    });
  };

  const eliminarCliente = async (cliente) => {
    try {
      const response = await fetch(
        "http://localhost:3070/eliminar/clientes/" + cliente.ID
      );

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(
          `Error al obtener los clientes: ${response.statusText}`
        );
      }

      await cargarClientes();
      cerrarVentana();
      window.location.reload();
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    } finally {
      cargando = false;
    }
  };

  const actualizarCliente = async (cliente) => {
    try {
      const response = await fetch(
        "http://localhost:3070/actualizar/clientes/" +
          cliente.ID +
          "/" +
          cliente.pais +
          "/" +
          cliente.telefono
      );

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(
          `Error al obtener los clientes: ${response.statusText}`
        );
      }

      await cargarClientes();
      cerrarVentana();
      window.location.reload();
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    } finally {
      cargando = false;
    }
  };

  // Mostrar detalles del cliente
  function mostrarInfo(cliente) {
    clienteSeleccionado = cliente;
    overlayActivo = true;
    ventanaActiva = true;
  }

  // Cerrar cualquier ventana activa
  function cerrarVentana() {
    ventanaEditarActiva = false;
    ventanaEliminarActiva = false;
    ventanaActiva = false;
    overlayActivo = false;
    clienteSeleccionado = null;
  }

  // Activar la ventana para confirmar eliminación
  function activarVentanaEliminar(cliente) {
    clienteSeleccionado = cliente;
    overlayActivo = true;
    ventanaEliminarActiva = true;
  }

  function activarVentanaEditar(cliente) {
    clienteSeleccionado = cliente;
    overlayActivo = true;
    ventanaEditarActiva = true;
  }

  // Cargar clientes al montar el componente
  cargarClientes();
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
      <div class="filtros" on:click={() => (filtroTipo = "Empresa")}>
        Compañías
      </div>
      <div class="filtros" on:click={() => (filtroTipo = "Individual")}>
        Individuales
      </div>
      <div class="filtros" on:click={() => (filtroTipo = "")}>Todos</div>
    </div>
  {/if}
</div>

<div id="contenedor-principal">
  {#if cargando}
    <p>Cargando clientes...</p>
  {:else if clientesFiltrados().length === 0}
    <p>No se encontraron clientes.</p>
  {:else}
    {#each clientesFiltrados() as cliente}
      <div id="card" class="cards">
        <div class="foto-texto" on:click={() => mostrarInfo(cliente)}>
          <img
            src="/img/defaultfoto2.webp"
            alt=""
            width="54"
            height="54"
            id="foto-perfil"
          />
          <div class="texto">
            <h3 class="nombre">{cliente.nombre}</h3>
            <p class="direccion">{cliente.pais}</p>
          </div>
        </div>
        <div class="iconos">
          <img
            src="/img/edit_24dp_CDCDCD_FILL0_wght400_GRAD0_opsz24 (1).png"
            alt=""
            on:click={() => activarVentanaEditar(cliente)}
          />
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

<!-- Ventana de información -->
{#if ventanaActiva}
  <div id="ventana" class="activo">
    <img src="/img/defaultfoto2.webp" alt="" width="60" height="60" />
    <h2>{clienteSeleccionado.nombre}</h2>
    <p>Entidad: {clienteSeleccionado.entidad}</p>
    <p>País: {clienteSeleccionado.pais}</p>
    <p>Teléfono: {clienteSeleccionado.telefono}</p>
    <button on:click={cerrarVentana}>Cerrar Ventana</button>
  </div>
{/if}

<!-- Ventana de confirmación de eliminación -->
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
  class={overlayActivo ? "overlay-activo" : "overlay-inactivo"}
></div>

{#if ventanaEditarActiva}
  <div id="ventana-editar-clientes">
    <h2>Editar {clienteSeleccionado.nombre}</h2>
    <label for="pais">País:</label>
    <input
      type="text"
      id="pais"
      name="pais"
      bind:value={clienteSeleccionado.pais}
    />
    <br />
    <label for="telefono">Teléfono:</label>
    <input
      type="tel"
      name="telefono"
      id="telefono"
      bind:value={clienteSeleccionado.telefono}
    />
    <div class="botones">
      <button type="button" on:click={cerrarVentana}>Cerrar</button>
      <button
        type="button"
        on:click={() => actualizarCliente(clienteSeleccionado)}
        >Actualizar</button
      >
    </div>
  </div>
{/if}
