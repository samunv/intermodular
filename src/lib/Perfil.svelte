<script>
  import "../css/global.css";
  import "../css/miperfil.css";

  let overlayActivo = false;

  // Datos del perfil
  let datosPerfil = {
    nombre: "Usuario",
    rol: "Gestor de inventario",
    info: {
      telefono: "661345213",
      correo: "usuario@email.com",
      ubicacion: "Madrid",
    },
  };

  // Estados para controlar las ventanas de edición
  let editRol = false;
  let editInfo = false;

  // Variables para los valores editados
  let newRol = datosPerfil.rol;
  let newTelefono = datosPerfil.info.telefono;
  let newCorreo = datosPerfil.info.correo;
  let newUbicacion = datosPerfil.info.ubicacion;

  // Función para guardar el rol
  function guardarRol() {
    datosPerfil.rol = newRol; // Actualiza el rol
    editRol = false; // Cierra la ventana de edición
    overlayActivo = false;
  }

  // Función para guardar la información
  function guardarInfo() {
    overlayActivo = false;
    datosPerfil.info.telefono = newTelefono; // Actualiza el teléfono
    datosPerfil.info.correo = newCorreo; // Actualiza el correo
    datosPerfil.info.ubicacion = newUbicacion; // Actualiza la ubicación
    editInfo = false; // Cierra la ventana de edición
  }
</script>

<div class="section-principal">
  <!-- Clase-Perfil -->
  <div class="Clase-Perfil">
    <img
      id="foto-de-perfil"
      src="/img/defaultfoto2.webp"
      alt="Usuario"
      width="45"
      height="45"
    />
    <div class="texto">
      <h3>{datosPerfil.nombre}</h3>
      <p>{datosPerfil.rol}</p>
    </div>
    <button
      aria-label="Editar Rol"
      on:click={() => ((editRol = true), (overlayActivo = true))}
      on:keydown={(e) => e.key === "Enter" && (editRol = true)}
      tabindex="0"
    >
      <img
        src="/img/edit_24dp_CDCDCD_FILL0_wght400_GRAD0_opsz24 (1).png"
        alt="Editar rol"
        width="25"
        height="25"
      />
    </button>
  </div>

  <!-- Ventana para editar el rol -->
  {#if editRol}
    <div class="ventana-edicion">
      <h3>Editar Rol</h3>
      <input type="text" bind:value={newRol} maxlength="25" minlength="5" />
      <div class="botones-ventana-editar">
        <button on:click={guardarRol}>Guardar</button>
        <button on:click={() => ((editRol = false), (overlayActivo = false))}
          >Cancelar</button
        >
      </div>
    </div>
  {/if}

  <!-- Info -->
  <div class="info">
    <h3>Información de Contacto</h3>
    <button
      aria-label="Editar Información"
      on:click={() => ((editInfo = true), (overlayActivo = true))}
      on:keydown={(e) => e.key === "Enter" && (editInfo = true)}
      tabindex="0"
      id="btn-editar-info"
    >
      <img
        src="/img/edit_24dp_CDCDCD_FILL0_wght400_GRAD0_opsz24 (1).png"
        alt="Editar información"
        width="25"
        height="25"
      />
    </button>
  </div>

  <!-- Ventana para editar información -->
  {#if editInfo}
    <div class="ventana-edicion">
      <h3>Editar Información</h3>
      <div class="campo">
        <label for="telefono">Teléfono</label>
        <input
          type="number"
          id="telefono"
          bind:value={newTelefono}
          minlength="9"
          maxlength="9"
        />
      </div>
      <div class="campo">
        <label for="correo">Correo</label>
        <input
          type="email"
          id="correo"
          bind:value={newCorreo}
          minlength="10"
          maxlength="30"
        />
      </div>
      <div class="campo">
        <label for="ubicacion">Ubicación</label>
        <input type="text" id="ubicacion" bind:value={newUbicacion} />
      </div>
      <div class="botones-ventana-editar">
        <button on:click={guardarInfo}>Guardar</button>
        <button on:click={() => ((editInfo = false), (overlayActivo = false))}
          >Cancelar</button
        >
      </div>
    </div>
  {/if}

  <!-- Información -->
  <div class="informacion">
    <p><strong>Teléfono:</strong> {datosPerfil.info.telefono}</p>
    <hr class="divider" />
    <p><strong>Correo:</strong> {datosPerfil.info.correo}</p>
    <hr class="divider" />
    <p><strong>Ubicación:</strong> {datosPerfil.info.ubicacion}</p>
  </div>
</div>

<div
  id="overlay"
  class={overlayActivo ? "overlay-activo" : "o verlay-inactivo"}
></div>
