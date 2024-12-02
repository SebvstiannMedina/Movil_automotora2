import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroVentaPage } from './registro-venta.page';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { ModalController, IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

// Mock de ServiceBDService
class ServiceBDServiceMock {
  getVentas() {
    return Promise.resolve([{ idVenta: 1, nombre: 'Venta 1' }, { idVenta: 2, nombre: 'Venta 2' }]);
  }

  getDetallesVenta(idVenta: number) {
    return Promise.resolve([{ idDetalle: 1, producto: 'Producto 1', cantidad: 2 }]);
  }
}

// Mock de ModalController
class ModalControllerMock {
  create = jasmine.createSpy('create').and.returnValue({
    present: jasmine.createSpy('present'),
    dismiss: jasmine.createSpy('dismiss'),
  });
}

describe('RegistroVentaPage', () => {
  let component: RegistroVentaPage;
  let fixture: ComponentFixture<RegistroVentaPage>;
  let modalControllerMock: ModalControllerMock;

  beforeEach(async () => {
    modalControllerMock = new ModalControllerMock();

    await TestBed.configureTestingModule({
      declarations: [RegistroVentaPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiceBDService, useClass: ServiceBDServiceMock },
        { provide: ModalController, useValue: modalControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroVentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verifica que se cargan las ventas', async () => {
    await component.cargarVentas();
    expect(component.ventas.length).toBe(2); // Verifica que se cargaron 2 ventas
  });

  it('verifica que se muestra los detalles de la venta seleccionada', async () => {
    await component.verDetalles(1);
    expect(modalControllerMock.create).toHaveBeenCalled();
    expect(modalControllerMock.create.calls.mostRecent().args[0].componentProps.detalles).toEqual([
      { idDetalle: 1, producto: 'Producto 1', cantidad: 2 },
    ]);
  });
});
