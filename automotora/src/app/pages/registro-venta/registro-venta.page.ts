import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-registro-venta',
  templateUrl: './registro-venta.page.html',
  styleUrls: ['./registro-venta.page.scss'],
})
export class RegistroVentaPage implements OnInit {
  ventas: any = [
    {
      idVenta: '',
      total: '',
      idusuario: '',
      subtotal: '',
      idCrud: ''
    }
  ];
  constructor(
    private alertController: AlertController, 
    private bd: ServiceBDService, 
    private router:Router
  ) { 
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchVenta().subscribe(res=>{
          this.ventas = res;
        })
      }
    })
  }

  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchVenta().subscribe(res=>{
          this.ventas = res;
        })
      }
    })
  }

}
