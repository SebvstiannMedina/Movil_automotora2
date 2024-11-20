import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroVentaPage } from './registro-venta.page';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { of } from 'rxjs'; // Importar el operador 'of' para crear observables
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

// Crear un mock de ServiceBDService
class ServiceBDServiceMock {
  dbState() {
    return of(true); // Simular que la base de datos está lista
  }
}

describe('RegistroVentaPage', () => {
  let component: RegistroVentaPage;
  let fixture: ComponentFixture<RegistroVentaPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroVentaPage],
      providers: [
        { provide: ServiceBDService, useClass: ServiceBDServiceMock }, // Usar el mock
        AlertController,
        Router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroVentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
