import { Component, OnInit } from '@angular/core';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { CartService } from 'src/app/service/cart.service';

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

  constructor(private bd: ServiceBDService, private cartService: CartService, ) {}

  ngOnInit() {
    this.bd.dbState().subscribe(ready => {
      if (ready) {
        this.cargarCategorias();
        this.cargarCrud();
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
    
    this.bd.fetchCrud().subscribe(Crud => {
      this.Crud = Crud.filter(crud => crud.idCategoria === idCategoria);
    });
  }

  volverACategorias() {
    this.categoriaSeleccionada = null;
    this.Crud = [];
  }

  anadirAlCarrito(producto: any) {
    this.cartService.addToCart(producto, 1); // Añadir una unidad del producto al carrito
  }
}
