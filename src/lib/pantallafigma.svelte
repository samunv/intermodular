<script>

  // Array que contiene los datos de pantallaPerfil
  let pantallaPerfil = [
    { titulo: "Mi perfil" },
    { nombre: "Jorge Anton" },
    { rol: "Rol: Organizador" },
    { textoinf: "Info. de Contacto" },
    { telefono: "661 345 213" },
    { correo: "usuario@email.com" },
    { ubicacion: "Madrid" },
  ];

  // Estado para controlar la visibilidad de las ventanas de edición
  let editRol = false;
  let editInfo = false;

  // Variables para guardar los valores editados
  let newRol = pantallaPerfil[2].rol;
  let newTelefono = pantallaPerfil[4].telefono;
  let newCorreo = pantallaPerfil[5].correo;
  let newUbicacion = pantallaPerfil[6].ubicacion;

  // Funciones para manejar la edición y el guardado de nuevos valores
  function guardarRol() {
    // Actualiza el rol en el array de pantallaPerfil
    pantallaPerfil[2].rol = newRol;
    editRol = false; // Cierra la ventana de edición
  }

  function guardarInfo() {
    // Actualiza la información en el array de pantallaPerfil
    pantallaPerfil[4].telefono = newTelefono;
    pantallaPerfil[5].correo = newCorreo;
    pantallaPerfil[6].ubicacion = newUbicacion;
    editInfo = false; // Cierra la ventana de edición
  }
</script>

<h1>{pantallaPerfil[0].titulo}</h1>
<div class="section-principal">
  <!-- Clase-Perfil -->
  <div class="Clase-Perfil">
    <img src="/img/usuario.png" alt="" width="45" height="45" />
    <div class="texto">
      <h2>{pantallaPerfil[1].nombre}</h2>
      <p>{pantallaPerfil[2].rol}</p>
    </div>
    <!-- Botón para editar el rol -->
    <button
      aria-label="Editar Rol"
      on:click={() => (editRol = true)}
      on:keydown={(e) => e.key === "Enter" && (editRol = true)}
      tabindex="0"
    >
      <img
        src="/img/editar-texto.png"
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
      <input type="text" bind:value={newRol} />
      <button on:click={guardarRol}>Guardar</button>
      <button on:click={() => (editRol = false)}>Cancelar</button>
    </div>
  {/if}

  <!-- Info -->
  <div class="info">
    <p>{pantallaPerfil[3].textoinf}</p>
    <div class="imginfo">
      <!-- Botón para editar la información -->
      <button
        aria-label="Editar Información"
        on:click={() => (editInfo = true)}
        on:keydown={(e) => e.key === "Enter" && (editInfo = true)}
        tabindex="0"
      >
        <img
          src="/img/editar-texto.png"
          alt="Editar información"
          width="25"
          height="25"
        />
      </button>
    </div>
  </div>

  <!-- Ventana para editar información -->
  {#if editInfo}
    <div class="ventana-edicion">
      <h3>Editar Información</h3>
      <div>
        <label for="telefono">Teléfono</label>
        <input type="text" id="telefono" bind:value={newTelefono} />
      </div>
      <div>
        <label for="correo">Correo</label>
        <input type="text" id="correo" bind:value={newCorreo} />
      </div>
      <div>
        <label for="ubicacion">Ubicación</label>
        <input type="text" id="ubicacion" bind:value={newUbicacion} />
      </div>
      <button on:click={guardarInfo}>Guardar</button>
      <button on:click={() => (editInfo = false)}>Cancelar</button>
    </div>
  {/if}

  <!-- Información -->
  <div class="informacion">
    <div class="item">Teléfono: {pantallaPerfil[4].telefono}</div>
    <hr class="divider" />
    <div class="item">Correo: {pantallaPerfil[5].correo}</div>
    <hr class="divider" />
    <div class="item">Ubicación: {pantallaPerfil[6].ubicacion}</div>
  </div>

  <!-- Navbar -->
  <div class="navbar">
    <img src="/img/image1.png" alt="Buscar" width="25" height="25" />
    <img src="/img/image2.png" alt="Calendario" width="25" height="25" />
    <img src="/img/image3.png" alt="Perfil" width="25" height="25" />
  </div>
</div>
