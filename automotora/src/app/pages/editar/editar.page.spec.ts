import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPage } from './editar.page';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Camera } from '@capacitor/camera';
import { of } from 'rxjs';

// Mock del servicio ServiceBDService
class MockServiceBDService {
  dbState() { return of(true); }
  fetchCategoria() { return of([{ id: 1, nombre: 'Categoria 1' }]); }
  modificarCrud() { return of(null); }
}

// Mock de ActivatedRoute
class MockActivatedRoute {
  queryParams = of({});
}

// Mock de Router
class MockRouter {
  getCurrentNavigation() {
    return {
      extras: {
        state: {
          crud: {
            idCrud: 1,
            nombre: 'Producto 1',
            descripcion: 'Descripción del producto',
            precio: 1000,
            idCategoria: 1,
            imagen: 'path/to/image',
          },
        },
      },
    };
  }
}

describe('EditarPage', () => {
  let component: EditarPage;
  let fixture: ComponentFixture<EditarPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarPage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: ServiceBDService, useClass: MockServiceBDService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
        AlertController,
        Camera,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verifica que se cargan las categorías', () => {
    component.cargarCategorias();
    expect(component.categorias).toEqual([{ id: 1, nombre: 'Categoria 1' }]);
  });

  it('verifica que se valide el precio correctamente', () => {
    const mockEvent = { target: { value: 'abc' } };
    component.validarPrecio(mockEvent);
    expect(component.mensajeError).toBe('Solo se permiten números');
  });

});
