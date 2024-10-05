import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-otros',
  templateUrl: './otros.page.html',
  styleUrls: ['./otros.page.scss'],
})
export class OtrosPage implements OnInit {

 
  // Definir el array de productos
  products = [
    {
      name: ' Espejo Retrovisor ',
      price: 24990,
      description: 'Espejo Retrovisor universal convexo ',
      image: 'https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/127181553_01/w=800,h=800,fit=pad'
    },
    {
      name: 'Led intermitente',
      price: 7664,
      description: 'X2 Ampolleta 144 Led Intermitente Py21 Pata En V 12v Ámbar',
      image: 'https://http2.mlstatic.com/D_NQ_NP_758773-MLC53781392571_022023-O.webp'
    },
    {
      name: 'Funda para asientos',
      price: 55000,
      description: 'Funda Cubre Asientos para Autos Negro con Tonos Grices MOMO',
      image: 'https://api.autoplanet.cl/medias/sys_master/images/hc9/h68/9633207287838/1054054_1-1682041641/1054054-1-1682041641.webp'
    },
    {
      name: 'Palanca de cambio',
      price: 28310,
      description: 'Articulacion Palanca Cambio Chevrolet Corsa 1.4 1.6 94 - 12',
      image: 'https://http2.mlstatic.com/D_NQ_NP_2X_607758-MLC73371013918_122023-F.webp'
    },
    // Añadir más productos aquí
  ];

  constructor() { }

  ngOnInit() {
    // Inicialización si es necesario
  }

}