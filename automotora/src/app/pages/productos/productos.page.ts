import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { CartService } from 'src/app/service/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  categorias: any[] = [];
  Crud: any[] = [];
  categoriaSeleccionada: number | null = null;
  nombreCategoriaSeleccionada: string = '';
  searchQuery: string = ''; // Nueva propiedad para el buscador

  constructor(
    private bd: ServiceBDService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.bd.dbState().subscribe(ready => {
      if (ready) {
        this.cargarCategorias();
        // Escuchar los parámetros de la URL
        this.route.queryParams.subscribe(params => {
          if (params['idCategoria']) {
            const idCategoria = +params['idCategoria']; // Convertir a número
            this.cargarCrudPorCategoria(idCategoria);
          } else {
            this.cargarCrud(); // Si no hay parámetros, cargar todos los productos
          }
        });
      }
    });
  }

  cargarCategorias() {
    this.bd.fetchCategoria().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  cargarCrud() {
    this.bd.fetchCrud().subscribe(crud => {
      this.Crud = crud;
    });
  }

  cargarCrudPorCategoria(idCategoria: number) {
    this.categoriaSeleccionada = idCategoria;
    this.nombreCategoriaSeleccionada = this.categorias.find(
      cat => cat.idCategoria === idCategoria
    )?.nomCateg || '';
  
    this.bd.fetchCrud().subscribe(crud => {
      // Filtrar por categoría
      let productosFiltrados = crud.filter(item => item.idCategoria === idCategoria);
      
      // Filtrar por nombre de producto si hay un valor en el buscador
      if (this.searchQuery.trim() !== '') {
        productosFiltrados = productosFiltrados.filter(producto =>
          producto.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      this.Crud = productosFiltrados;
      console.log('Productos filtrados:', this.Crud); // Verificar en la consola
      this.cdr.detectChanges();
    });
  }

  filtrarProductos() {
    if (this.categoriaSeleccionada !== null) {
      // Si hay una categoría seleccionada, recargar los productos filtrados
      this.cargarCrudPorCategoria(this.categoriaSeleccionada);
    } else {
      // Si no hay categoría seleccionada, cargar todos los productos
      this.cargarCrud();
    }
  }

  volverACategorias() {
    this.categoriaSeleccionada = null;
    this.cargarCrud(); // Volvemos a cargar todos los productos
  }

  anadirAlCarrito(producto: any) {
    this.cartService.addToCart(producto, 1); // Añadir una unidad del producto al carrito
  }
}
