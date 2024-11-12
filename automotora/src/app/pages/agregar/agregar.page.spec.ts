import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarPage } from './agregar.page';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Router } from '@angular/router';

describe('AgregarPage', () => {
  let component: AgregarPage;
  let fixture: ComponentFixture<AgregarPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarPage],
      providers: [
        { provide: AlertController, useValue: { create: () => Promise.resolve({ present: () => Promise.resolve() }) } },
        { provide: ServiceBDService, useValue: { insertarCrud: () => Promise.resolve() } },
        { provide: Router, useValue: { navigate: () => Promise.resolve() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Verifica el precio correcto', () => {
    const event = { target: { value: '1500.50' } };
    component.validarPrecio(event);
    expect(component.mensajeError).toBe('');
  });
});