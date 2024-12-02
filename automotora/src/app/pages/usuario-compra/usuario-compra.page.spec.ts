import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioCompraPage } from './usuario-compra.page';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { ModalController, IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { Venta } from 'src/app/service/venta';

// Mock de ServiceBDService
class ServiceBDServiceMock {
  getComprasUsuario() {
    return Promise.resolve([{ idVenta: 1, total: 100 }, { idVenta: 2, total: 200 }]);
  }

  getDetallesVenta(idVenta: number) {
    return Promise.resolve([{ producto: 'Producto 1', cantidad: 2 }]);
  }
}

// Mock de ModalController
class ModalControllerMock {
  create = jasmine.createSpy('create').and.returnValue({
    present: jasmine.createSpy('present'),
    dismiss: jasmine.createSpy('dismiss'),
  });
}

describe('UsuarioCompraPage', () => {
  let component: UsuarioCompraPage;
  let fixture: ComponentFixture<UsuarioCompraPage>;
  let modalControllerMock: ModalControllerMock;

  beforeEach(async () => {
    modalControllerMock = new ModalControllerMock();

    await TestBed.configureTestingModule({
      declarations: [UsuarioCompraPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiceBDService, useClass: ServiceBDServiceMock },
        { provide: ModalController, useValue: modalControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioCompraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verifica que se cargan las compras', async () => {
    await component.cargarCompras();
    expect(component.compras.length).toBe(2); // Verifica que se cargaron 2 compras
  });

  it('verifica que se muestra los detalles de la venta seleccionada', async () => {
    await component.verDetalles(1);
    expect(modalControllerMock.create).toHaveBeenCalled();
    expect(modalControllerMock.create.calls.mostRecent().args[0].componentProps.detalles).toEqual([
      { producto: 'Producto 1', cantidad: 2 },
    ]);
  });

  it('verifica que carga las compras en cadena', async () => {
    component.cargando = false;
    const comprasPromise = component.cargarCompras();
    expect(component.cargando).toBeTrue(); // El indicador de carga se activa
    await comprasPromise;
    expect(component.cargando).toBeFalse(); // El indicador de carga se desactiva
  });
});
