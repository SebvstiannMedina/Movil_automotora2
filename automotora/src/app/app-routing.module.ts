import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login', //lo cambie solo para que lo veas
    pathMatch: 'full'
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'carrito-compra',
    loadChildren: () => import('./pages/carrito-compra/carrito-compra.module').then( m => m.CarritoCompraPageModule)
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./pages/editar-perfil/editar-perfil.module').then( m => m.EditarPerfilPageModule)
  },
  {
    path: 'cambio-contra',
    loadChildren: () => import('./pages/cambio-contra/cambio-contra.module').then( m => m.CambioContraPageModule)
  },
  {
    path: 'nosotros',
    loadChildren: () => import('./pages/nosotros/nosotros.module').then( m => m.NosotrosPageModule)
  },

  {
    path: 'agregar',
    loadChildren: () => import('./pages/agregar/agregar.module').then( m => m.AgregarPageModule)
  },
  {
    path: 'editar',
    loadChildren: () => import('./pages/editar/editar.module').then( m => m.EditarPageModule)
  },
  {
    path: 'eliminar',
    loadChildren: () => import('./pages/eliminar/eliminar.module').then( m => m.EliminarPageModule)
  },
  {
    path: 'ver-perfil',
    loadChildren: () => import('./pages/ver-perfil/ver-perfil.module').then( m => m.VerPerfilPageModule)
  },
  {
    path: 'recupera-contra',
    loadChildren: () => import('./pages/recupera-contra/recupera-contra.module').then( m => m.RecuperaContraPageModule)
  },
  {
    path: 'registro-venta',
    loadChildren: () => import('./pages/registro-venta/registro-venta.module').then( m => m.RegistroVentaPageModule)
  },
  {
    path: 'que-frecuente',
    loadChildren: () => import('./pages/que-frecuente/que-frecuente.module').then( m => m.QueFrecuentePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'ubicacion',
    loadChildren: () => import('./pages/ubicacion/ubicacion.module').then( m => m.UbicacionPageModule)
  },
  {
    path: 'apivalores',
    loadChildren: () => import('./pages/apivalores/apivalores.module').then( m => m.ApivaloresPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.module').then( m => m.ProductosPageModule)
  }, 
  {
    path: 'hist-usuario',
    loadChildren: () => import('./pages/hist-usuario/hist-usuario.module').then( m => m.HistUsuarioPageModule)
  },
  {
    path: 'histdetalle',
    loadChildren: () => import('./pages/histdetalle/histdetalle.module').then( m => m.HistdetallePageModule)
  },
  {
    path: 'usuario-compra',
    loadChildren: () => import('./pages/usuario-compra/usuario-compra.module').then( m => m.UsuarioCompraPageModule)
  },
  {
    path: 'usuariodetalle',
    loadChildren: () => import('./pages/usuariodetalle/usuariodetalle.module').then( m => m.UsuariodetallePageModule)
  },











  //Esta tiene que ser la ultima si o si
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },
 
  

  

  


  



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
