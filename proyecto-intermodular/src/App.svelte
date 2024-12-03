<script>
  import { Router, Route } from 'svelte-routing';
  import BuscarClientes from './paginas/BuscarClientes.svelte';
  import MiPerfil from './paginas/MiPerfil.svelte';
  import Inventario from './paginas/Inventario.svelte';
  import VerPedidos from './paginas/VerPedidos.svelte';
</script>

<Router>
  <main>
    <Route path="/buscarclientes" component={BuscarClientes} />
    <Route path="/" component={VerPedidos} />
    <Route path="/miperfil" component={MiPerfil} />
    <Route path="/inventario" component={Inventario}></Route>
  </main>
</Router>