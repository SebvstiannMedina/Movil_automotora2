import { Component, OnInit } from '@angular/core';
import { ServiceBDService } from 'src/app/service/service-bd.service';
;

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

  constructor(private bd: ServiceBDService) {}

  ngOnInit() {
    this.bd.dbState().subscribe(ready => {
      if (ready) {
        this.cargarCategorias();
      }
    });
  }

  cargarCategorias() {
    this.bd.fetchCategoria().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  cargarCrudPorCategoria(idCategoria: number) {
    this.categoriaSeleccionada = idCategoria;
    // Guardamos el nombre de la categoría seleccionada
    this.nombreCategoriaSeleccionada = this.categorias.find(
      cat => cat.idCategoria === idCategoria
    )?.nomCateg || '';
    
    this.bd.fetchCrud().subscribe(Crud => {
      // Filtramos los Crud por la categoría seleccionada
      this.Crud = Crud.filter(Crud => 
        Crud.idCategoria === idCategoria
      );
    });
  }

  volverACategorias() {
    this.categoriaSeleccionada = null;
    this.Crud = [];
  }
}