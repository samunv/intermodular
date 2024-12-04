<script>
  import "../css/global.css";
  import "../css/pedidos.css";

  let pedidos = [];
  let cargando = true;
  let valor = "";
  let filtroTipo = ""; // Estado del filtro ("" para mostrar todos)
  let ventanaCrearActiva = false;
  let ventanaEditarActiva = false;

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
  const actualizarPedidos = async (pedido) => {
    // Verificar que tanto 'numero' como 'cantidad' estén definidos y sean válidos
    if ( !pedido.cantidad) {
    alert("Por favor, asegúrate de ingresar valores válidos.");
    return;
  }
  try {
    const response = await fetch(
      "http://localhost:3080/actualizar/pedidos/" +
          pedido.numero +
          "/" +
          pedido.cantidad
    );
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(
        `Error al obtener los clientes: ${response.statusText}`
      );
    }
    await cargarPedidos();
    cerrarVentana();
    window.location.reload();
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
  } finally {
    cargando = false;
  }
};

function activarVentanaEditar(pedido) {
    pedidoSeleccionado = pedido;
    overlayActivo = true;
    ventanaEditarActiva = true;
    console.log(pedidoSeleccionado);  // Verifica que el campo 'numero' está presente

  }

  let ID_cliente = "";
  let ID_producto = "";
  let cantidad = "";
  let fecha_compra = "";
  let fecha_entrega = "";
  let forma_de_pago = "";

  const crearPedido = async () => {
    try {
      const response = await fetch(
        "http://localhost:3080/crear/pedidos/" +
          ID_cliente +
          "/" +
          ID_producto +
          "/" +
          cantidad +
          "/" +
          fecha_compra +
          "/" +
          fecha_entrega +
          "/" +
          forma_de_pago
      );
    
    if (!response.ok) {
      throw new Error(`Error al crear el pedido: ${response.statusText}`);
    }
   
    await cargarPedidos();
      cerrarVentana();
      window.location.reload();
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    } finally {
      cargando = false;
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
    ventanaEditarActiva = false;
    ventanaActiva = false;
    ventanaEliminarActiva = false;
    overlayActivo = false;
    pedidoSeleccionado = null;
    ventanaCrearActiva=false;
    ID_cliente = "";
    ID_producto = "";
    cantidad = "";
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
        throw new Error(
          `Error al obtener los pedidos: ${response.statusText}`
        );
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
  <div class="cards" id="crear-pedido" on:click={activarVentanaCrear}>
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
    <p>
      <label for="cantidad">Stock:</label><br />
      <input
        type="number"
        id="cantidad"
        bind:value={pedidoSeleccionado.cantidad}
        aria-label="Cantidad en stock"
      /> Uds.
    </p>

    <div class="botones">
      <button on:click={cerrarVentana}>Cerrar</button>
      <button
        type="button"
        on:click={() => actualizarPedidos(pedidoSeleccionado)}
        >Actualizar</button
      >
    </div>
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

    <label for="ID_cliente">ID Cliente</label>
    <input
      type="number"
      id="ID_cliente"
      bind:value={ID_cliente}
      required
    />
    <br />

    <label for="ID_producto">ID Producto</label>
    <input
      type="number"
      id="ID_producto"
      bind:value={ID_producto}
      required
    />
    <br />

    <label for="cantidad">Cantidad</label>
    <input
      type="number"
      id="cantidad"
      bind:value={cantidad}
      required
      min="1"
    />
    <br />

    <label for="fecha_compra">Fecha de Compra</label>
    <input
      type="date"
      id="fecha_compra"
      bind:value={fecha_compra}
      required
    />
    <br />

    <label for="fecha_entrega">Fecha de Entrega</label>
    <input
      type="date"
      id="fecha_entrega"
      bind:value={fecha_entrega}
      required
    />
    <br />

    <label for="forma_de_pago">Forma de Pago</label>
    <select id="forma_de_pago" bind:value={forma_de_pago} required>
      <option value="" disabled selected>Seleccione una forma de pago</option>
      <option value="Efectivo">Efectivo</option>
      <option value="Tarjeta de crédito">Tarjeta de crédito</option>
    </select>
    <br />

    <div class="botones">
      <button type="button" on:click={cerrarVentana}>Cancelar</button>
      <button
        type="button"
        on:click={() => {
          if (ID_cliente && ID_producto && cantidad && fecha_compra && fecha_entrega && forma_de_pago) {
            crearPedido();
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

<button class="btn-csv" on:click={exportarPedidosCSV}
  ><img src="/img/archivo-excel.png" alt="" width="30" height="30" /></button
>
