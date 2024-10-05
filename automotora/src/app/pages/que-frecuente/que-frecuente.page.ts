import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-que-frecuente',
  templateUrl: './que-frecuente.page.html',
  styleUrls: ['./que-frecuente.page.scss'],
})
export class QueFrecuentePage implements OnInit {
  items: string[] = [];
  itemCount: number = 50;
  constructor() { }

  ngOnInit() {
    this.loadInitialItems();
  }
  loadInitialItems() {
    for (let i = 1; i <= this.itemCount; i++) {
      this.items.push(`Pregunta ${i}`);
    }
  }
  loadMoreItems(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      const currentLength = this.items.length;
      for (let i = currentLength + 1; i <= currentLength + this.itemCount; i++) {
        this.items.push(`Pregunta ${i}`);
      }
      event.target.complete();

      /* Si quieres detener el infinite scroll cuando llegues a un cierto nÃºmero de items*/
      if (this.items.length >= 200) {
        event.target.disabled = true;
      }
    }, 500);
  }

}
