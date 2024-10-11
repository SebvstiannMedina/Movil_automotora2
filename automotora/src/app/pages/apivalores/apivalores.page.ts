import { Component, OnInit } from '@angular/core';
import { ApivaloresService } from '../../services/apivalores.service';

@Component({
  selector: 'app-apivalores',
  templateUrl: './apivalores.page.html',
  styleUrls: ['./apivalores.page.scss'],
})
export class ApivaloresPage implements OnInit {

  dolar: any;
  euro: any;

  constructor(private apivaloresService: ApivaloresService) { }

  ngOnInit() {
    this.apivaloresService.getValores().subscribe(data => {
      this.dolar = data.dolar.valor;
      this.euro = data.euro.valor;
    });
  }
}
