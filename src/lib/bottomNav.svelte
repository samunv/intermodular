<script>
  import { onMount } from "svelte";

  // Títulos dinámicos basados en la URL
  let titulo = "";
  let rutaActiva = "";

  onMount(() => {
    const ruta = window.location.pathname;
    rutaActiva = ruta; // Guardamos la ruta actual para determinar el icono activo

    // Establecemos el título basado en la ruta
    if (ruta=== "/buscarclientes") {
      titulo = "Buscar Clientes";
    } else if (ruta === "/") {
      titulo = "Calendario"; // Título predeterminado
    } else if (ruta=== "/miperfil") {
      titulo = "Mi Perfil"; // Título predeterminado
    }
  });


  // Aplicar iconos del tema
  const temaGuardado = localStorage.getItem("temaCambiado");
</script>

<footer id="navegador-bajo">
  <a href="/buscarclientes">
    <img 
      src={rutaActiva=== "/buscarclientes" ? "/img/person_search_24dp_0756FF_FILL0_wght400_GRAD0_opsz24.png" : "/img/person_search_24dp_CDCDCD_FILL0_wght400_GRAD0_opsz24.png"}
      alt="Buscar Clientes"
      height="30"
      width="30"
    />
  </a>
  <a href="/">
    <img 
      src={rutaActiva === "/" ? "/img/calendar_month_24dp_0756FF_FILL0_wght400_GRAD0_opsz24 (1).png" : "/img/calendar_month_24dp_CDCDCD_FILL0_wght400_GRAD0_opsz24 (1).png"}
      alt="Calendario"
      height="30"
      width="30"
    />
  </a>
  <a href="/inventario">
    <img 
      src={rutaActiva === "/inventario" ? "/img/inventory_2_24dp_0756FF_FILL0_wght400_GRAD0_opsz24.png" : "/img/inventory_2_24dp_CDCDCD_FILL0_wght400_GRAD0_opsz24.png"}
      alt="Inventario"
      height="30"
      width="30"
    />
  </a>
  <a href="/miperfil">
    <img 
      src={rutaActiva === "/miperfil" ? "/img/person_24dp_0756FF_FILL0_wght400_GRAD0_opsz24 (1).png" : "/img/person_24dp_CDCDCD_FILL0_wght400_GRAD0_opsz24 (1).png"}
      alt="Mi Perfil"
      height="30"
      width="30"
    />
  </a>


</footer>
