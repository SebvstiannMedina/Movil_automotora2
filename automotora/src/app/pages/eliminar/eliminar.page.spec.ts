import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EliminarPage } from './eliminar.page';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { of } from 'rxjs';

// Crear mocks para los servicios
class RouterMock {
  navigate = jasmine.createSpy('navigate');
}

class AlertControllerMock {
  create = jasmine.createSpy('create').and.returnValue({
    present: jasmine.createSpy('present'),
  });
}

class ServiceBDServiceMock {
  dbState = jasmine.createSpy('dbState').and.returnValue(of(true));
  fetchCrud = jasmine.createSpy('fetchCrud').and.returnValue(of([]));  // Simula que la base de datos está vacía
  eliminarCrud = jasmine.createSpy('eliminarCrud');
}

describe('EliminarPage', () => {
  let component: EliminarPage;
  let fixture: ComponentFixture<EliminarPage>;
  let serviceBDMock: ServiceBDServiceMock;
  let alertControllerMock: AlertControllerMock;
  let routerMock: RouterMock;

  beforeEach(() => {
    serviceBDMock = new ServiceBDServiceMock();
    alertControllerMock = new AlertControllerMock();
    routerMock = new RouterMock();

    TestBed.configureTestingModule({
      declarations: [EliminarPage],
      providers: [
        { provide: ServiceBDService, useValue: serviceBDMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EliminarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verifica que se llame a la navegación con la ruta correcta y los datos correctos', () => {
    const crudItem = { idCrud: 1 };  
    component.modificar(crudItem);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/editar'], {
      state: { crud: crudItem }
    });
  });

  it('Elimina los productos seleccionados', () => {
    const crudItem = { idCrud: 1 };  // Simula un item de datos
    component.eliminar(crudItem);
    
    // Verifica que `eliminarCrud` haya sido llamado con el id correcto
    expect(serviceBDMock.eliminarCrud).toHaveBeenCalledWith(1);
  });

  it('navega a agregar', () => {
    component.agregar();
    
    // Verifica que la navegación hacia '/agregar' haya sido llamada
    expect(routerMock.navigate).toHaveBeenCalledWith(['/agregar']);
  });
});
