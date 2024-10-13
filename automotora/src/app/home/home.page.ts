import { Component, OnInit } from '@angular/core';
import { ApitimeService } from '../services/apitime.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  chileTime!: string;

  constructor(private apitimeService: ApitimeService) {}

  ngOnInit() {
    this.apitimeService.getChiletime().subscribe(
      (data: any) => {
        this.chileTime = data.datetime; // Obtén el campo `datetime` de la API
      },
      (error) => {
        console.error('Error fetching time:', error);
      }
    );
  }
}
