<script>
  import { Link } from "svelte-routing";
  import { onMount } from "svelte";

  let titulo = "";
  let temaCambiado = false; // Estado inicial del tema
  let srcIconoTema = "/img/wb_sunny_24dp_WHITE_FILL0_wght400_GRAD0_opsz24.png";

  onMount(() => {
    // Configurar título dinámico
    const path = window.location.pathname;
    if (path === "/buscarclientes") {
      titulo = "Clientes";
    } else if (path === "/") {
      titulo = "Pedidos";
    } else if (path === "/miperfil") {
      titulo = "Mi Perfil";
    }else if (path === "/inventario"){
      titulo = "Inventario"
    }

    // Recuperar el tema desde localStorage
    const temaGuardado = localStorage.getItem("temaCambiado");
    if (temaGuardado) {
      temaCambiado = JSON.parse(temaGuardado);
      aplicarTema(temaCambiado);
    }
  });

  function cambiarTema() {
    temaCambiado = !temaCambiado;

    // Guardar el estado en localStorage
    localStorage.setItem("temaCambiado", JSON.stringify(temaCambiado));

    // Aplicar el tema
    aplicarTema(temaCambiado);
  }

  function aplicarTema(tema) {
    const root = document.documentElement;
    if (tema) {
      srcIconoTema = "/img/dark_mode_24dp_BLACK_FILL0_wght400_GRAD0_opsz24.png";
      root.style.setProperty("--main-color", "white");
      root.style.setProperty("--secondary-color", "#E3E3E3");
      root.style.setProperty("--text-color", "black");
    } else {
      srcIconoTema = "/img/wb_sunny_24dp_WHITE_FILL0_wght400_GRAD0_opsz24.png";
      root.style.setProperty("--main-color", "#333336");
      root.style.setProperty("--secondary-color", "black");
      root.style.setProperty("--text-color", "white");
    }
  }
</script>

<header>
  <h1 id="titulo-pagina">{titulo}</h1>
  <nav>
    <Link class="enlace-nav" to="/buscarclientes">Clientes</Link>
    <Link class="enlace-nav" to="/">Pedidos</Link>
    <Link class="enlace-nav" to="/inventario">Inventario</Link>
    <Link class="enlace-nav" to="/miperfil">Mi Perfil</Link>
    
    
  </nav>

  <div id="contenedor-cambiar-tema" on:click={() => cambiarTema()}>
    <p id="texto-tema">Cambiar a</p>
    <img src={srcIconoTema} alt="Cambiar tema" width="25" height="25" />
  </div>
</header>
