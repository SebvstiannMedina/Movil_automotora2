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
    // Array de preguntas predefinidas
    const preguntas = [
      "¿Cuál es tu hobby favorito?",
      "¿Qué te gustaría aprender en el futuro?",
      "Si pudieras viajar a cualquier parte del mundo, ¿a dónde irías?",
      "¿Quién es tu modelo a seguir?",
      "¿Cuál es el libro que más te ha impactado?",
      "¿Qué es lo que más valoras en una amistad?",
      "¿Tienes alguna tradición familiar?",
      "¿Cuál es tu película favorita?",
      "¿Qué te inspira a ser mejor cada día?",
      "Si pudieras tener un superpoder, ¿cuál elegirías?"
    ];
  
    for (let i = 1; i <= this.itemCount; i++) {
      // Seleccionamos una pregunta aleatoria del array
      const randomQuestion = preguntas[Math.floor(Math.random() * preguntas.length)];
      this.items.push(randomQuestion);
    }
  }
  
  loadMoreItems(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      const currentLength = this.items.length;
  
      // Array de preguntas predefinidas
      const preguntas = [
        "¿Cuál es tu hobby favorito?",
        "¿Qué te gustaría aprender en el futuro?",
        "Si pudieras viajar a cualquier parte del mundo, ¿a dónde irías?",
        "¿Quién es tu modelo a seguir?",
        "¿Cuál es el libro que más te ha impactado?",
        "¿Qué es lo que más valoras en una amistad?",
        "¿Tienes alguna tradición familiar?",
        "¿Cuál es tu película favorita?",
        "¿Qué te inspira a ser mejor cada día?",
        "Si pudieras tener un superpoder, ¿cuál elegirías?"
      ];
  
      for (let i = currentLength + 1; i <= currentLength + this.itemCount; i++) {
        // Seleccionamos una pregunta aleatoria del array
        const randomQuestion = preguntas[Math.floor(Math.random() * preguntas.length)];
        this.items.push(randomQuestion);
      }
  
      event.target.complete();
  
      // Si quieres detener el infinite scroll cuando llegues a un cierto número de items
      if (this.items.length >= 200) {
        event.target.disabled = true;
      }
    }, 500);
  }
  

}
