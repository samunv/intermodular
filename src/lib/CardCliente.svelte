<script>
  // Importación de los estilos
  import "../css/clientes.css";
  import "../css/global.css";

  // Variables de estado
  let clientes = []; // Lista de clientes cargados desde el servidor
  let cargando = true; // Indica si los datos están siendo cargados
  let activarFiltros = false; // Controla la visibilidad de los filtros
  let valor = ""; // Valor del campo de búsqueda
  let filtroTipo = ""; // Filtro por tipo de cliente ("" para todos)
  let ventanaActiva = false; // Indica si la ventana de detalles está activa
  let overlayActivo = false; // Indica si el overlay (fondo) está activo
  let clienteSeleccionado = null; // Cliente seleccionado para editar/eliminar
  let ventanaEliminarActiva = false; // Indica si la ventana de eliminación está activa
  let ventanaEditarActiva = false; // Indica si la ventana de edición está activa
  let ventanaCrearActiva = false; // Indica si la ventana de creación está activa

  // Función para cargar los clientes desde el servidor
  const cargarClientes = async () => {
    try {
      const response = await fetch("http://localhost:3080/clientes");

      // Verifica si la respuesta del servidor es exitosa
      if (!response.ok) {
        throw new Error(
          `Error al obtener los clientes: ${response.statusText}`
        );
      }

      // Asigna los datos de la respuesta a la variable 'clientes'
      clientes = await response.json();
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    } finally {
      cargando = false; // Cambia el estado de 'cargando' a falso cuando se termina la carga
    }
  };

  // Función para filtrar los clientes según el valor de búsqueda y el tipo seleccionado
  const clientesFiltrados = () => {
    return clientes.filter((cliente) => {
      const coincideBusqueda = cliente.nombre
        .toLowerCase()
        .includes(valor.toLowerCase()); // Filtra por nombre
      const coincideTipo = filtroTipo === "" || cliente.entidad === filtroTipo; // Filtra por tipo (Empresa o Individual)
      return coincideBusqueda && coincideTipo; // Devuelve los clientes que coinciden con ambos filtros
    });
  };

  // Función para eliminar un cliente seleccionado
  const eliminarCliente = async (cliente) => {
    try {
      const response = await fetch(
        "http://localhost:3080/eliminar/clientes/" + cliente.ID
      );

      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(
          `Error al obtener los clientes: ${response.statusText}`
        );
      }

      await cargarClientes(); // Vuelve a cargar la lista de clientes
      cerrarVentana(); // Cierra la ventana activa
      window.location.reload(); // Recarga la página
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    } finally {
      cargando = false; // Cambia el estado de 'cargando' a falso
    }
  };

  // Función para actualizar los datos de un cliente
  const actualizarCliente = async (cliente) => {
    try {
      const response = await fetch(
        "http://localhost:3080/actualizar/clientes/" +
          cliente.ID +
          "/" +
          cliente.pais +
          "/" +
          cliente.telefono
      );

      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(
          `Error al obtener los clientes: ${response.statusText}`
        );
      }

      await cargarClientes(); // Vuelve a cargar la lista de clientes
      cerrarVentana(); // Cierra la ventana activa
      window.location.reload(); // Recarga la página
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    } finally {
      cargando = false; // Cambia el estado de 'cargando' a falso
    }
  };

  // Variables para el formulario de creación de cliente
  let nombre = "";
  let pais = "";
  let entidad = "";
  let telefono = "";

  // Función para crear un nuevo cliente
  const crearCliente = async () => {
    try {
      const response = await fetch(
        "http://localhost:3080/crear/clientes/" +
          nombre +
          "/" +
          pais +
          "/" +
          entidad +
          "/" +
          telefono
      );

      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(
          `Error al obtener los clientes: ${response.statusText}`
        );
      }

      await cargarClientes(); // Vuelve a cargar la lista de clientes
      cerrarVentana(); // Cierra la ventana activa
      window.location.reload(); // Recarga la página
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    } finally {
      cargando = false; // Cambia el estado de 'cargando' a falso
    }
  };

  // Función para mostrar los detalles de un cliente
  function mostrarInfo(cliente) {
    clienteSeleccionado = cliente; // Asigna el cliente seleccionado
    overlayActivo = true; // Activa el overlay
    ventanaActiva = true; // Activa la ventana de detalles
  }

  // Función para cerrar cualquier ventana activa
  function cerrarVentana() {
    ventanaEditarActiva = false; // Cierra la ventana de edición
    ventanaEliminarActiva = false; // Cierra la ventana de eliminación
    ventanaCrearActiva = false; // Cierra la ventana de creación
    ventanaActiva = false; // Cierra la ventana de detalles
    overlayActivo = false; // Desactiva el overlay
    clienteSeleccionado = null; // Resetea el cliente seleccionado
    nombre = ""; // Resetea el valor de 'nombre'
    pais = ""; // Resetea el valor de 'pais'
    entidad = ""; // Resetea el valor de 'entidad'
    telefono = ""; // Resetea el valor de 'telefono'
  }

  // Función para activar la ventana de confirmación de eliminación
  function activarVentanaEliminar(cliente) {
    clienteSeleccionado = cliente; // Asigna el cliente seleccionado
    overlayActivo = true; // Activa el overlay
    ventanaEliminarActiva = true; // Activa la ventana de eliminación
  }

  // Función para activar la ventana de edición de cliente
  function activarVentanaEditar(cliente) {
    clienteSeleccionado = cliente; // Asigna el cliente seleccionado
    overlayActivo = true; // Activa el overlay
    ventanaEditarActiva = true; // Activa la ventana de edición
  }

  // Función para activar la ventana de creación de cliente
  function activarVentanaCrear() {
    ventanaCrearActiva = true; // Activa la ventana de creación
    overlayActivo = true; // Activa el overlay
  }

  // Carga los clientes al montar el componente
  cargarClientes();

  // Función para exportar los clientes a un archivo CSV
  function exportarClientesCSV() {
    const encabezados = ["ID", "Nombre", "País", "Entidad", "Teléfono"]; // Encabezados del CSV

    const filas = clientes.map((cliente) => [
      cliente.ID, // ID del cliente
      cliente.nombre, // Nombre del cliente
      cliente.pais, // País del cliente
      cliente.entidad, // Entidad del cliente
      cliente.telefono, // Teléfono del cliente
    ]);

    // Convierte los datos a formato CSV
    const contenidoCSV = [encabezados, ...filas]
      .map((fila) => fila.join(","))
      .join("\n");

    // Crea un archivo CSV y lo descarga
    const blob = new Blob([contenidoCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes.csv";
    a.click();
    URL.revokeObjectURL(url); // Revoca la URL del archivo
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
    <div class="cards" id="crear-cliente" on:click={activarVentanaCrear}>
      Crear nuevo cliente
      <img
        src="/img/add_circle_24dp_WHITE_FILL0_wght400_GRAD0_opsz24.png"
        alt=""
        width="24"
        height="24"
      />
    </div>
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

{#if ventanaCrearActiva}
  <div id="ventana-crear-cliente">
    <h2>Crear nuevo Cliente</h2>

    <label for="nombre">Nombre</label>
    <input
      type="text"
      id="nombre"
      bind:value={nombre}
      required
      minlength="5"
      maxlength="15"
    />
    <br />

    <label for="pais">País</label>
    <input
      type="text"
      id="pais"
      bind:value={pais}
      required
      minlength="5"
      maxlength="15"
    />
    <br />

    <label for="entidad">Entidad</label>
    <select id="entidad" bind:value={entidad} required>
      <option value="" disabled selected>Seleccione una entidad</option>
      <option value="Empresa">Empresa</option>
      <option value="Individual">Individual</option>
    </select>
    <br />

    <label for="telefono">Teléfono</label>
    <input
      type="tel"
      id="telefono"
      bind:value={telefono}
      required
      minlength="5"
      maxlength="15"
    />
    <div class="botones">
      <button type="button" on:click={cerrarVentana}>Cancelar</button>
      <button
        type="button"
        on:click={() => {
          if (nombre && pais && entidad && telefono) {
            crearCliente();
          } else {
            alert("Por favor, completa todos los campos requeridos.");
          }
        }}
      >
        Crear
      </button>
    </div>
  </div>
{/if}

<button class="btn-csv" on:click={exportarClientesCSV}
  ><img src="/img/archivo-excel.png" alt="" width="30" height="30" /></button
>
