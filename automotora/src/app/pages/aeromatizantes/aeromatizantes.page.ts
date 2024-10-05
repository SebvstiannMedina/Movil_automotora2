import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aeromatizantes',
  templateUrl: './aeromatizantes.page.html',
  styleUrls: ['./aeromatizantes.page.scss'],
})
export class AeromatizantesPage implements OnInit {

  // Definir el array de productos
  aeromatizantes = [
    {
      name: 'Aromatizante Glade Auto Esencia Auto Nuevo',
      price: 12000,
      description: 'Aeromatizante Glade.',
      image: 'https://easycl.vtexassets.com/arquivos/ids/300411/1152016-03.jpg?v=637530216465300000'
    },
    {
      name: 'Little Trees Pino Aromatizante Royal Pine 1 Unid',
      price: 200000,
      description: 'Aeromatizante Little Trees Pino',
      image: 'https://santaisabel.vtexassets.com/arquivos/ids/177985/Aromatizante-para-Auto-Little-Trees-Pino-1-Unidad.jpg?v=637635341246600000'
    },
    {
      name: 'Ambientador Auto Frutos Rojos 8 ml',
      price: 5800,
      description: 'Ambientador Auto Frutos Rojos 8 ml',
      image: 'https://cdnx.jumpseller.com/jardindehadas/image/11817055/Ambientador-Auto-Frutos-Rojos-8-ml-Boles-d-olor-8432097083734.jpg?1603486397'
    },
    {
      name: 'Pack 3 Aromatizantes Auto Deosol Variedad De Aromas',
      price: 10.990,
      description: 'Aeromatizantes tree pack, variedades',
      image: 'https://http2.mlstatic.com/D_NQ_NP_900664-MLC52802648376_122022-O.webp'
    },
    // Añadir más productos aquí
  ];

  constructor() { }

  ngOnInit() {
    // Inicialización si es necesario
  }

}