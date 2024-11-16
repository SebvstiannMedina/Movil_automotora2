import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambioContraPage } from './cambio-contra.page';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { of } from 'rxjs';

class RouterMock {
  getCurrentNavigation = jasmine.createSpy('getCurrentNavigation').and.returnValue({
    extras: {
      state: { user: { idusuario: 1, nombre: 'TestUser' } },
    },
  });
  navigate = jasmine.createSpy('navigate');
}

class ActivatedRouteMock {
  queryParams = of({});
}

class AlertControllerMock {
  create = jasmine.createSpy('create').and.returnValue({
    present: jasmine.createSpy('present'),
  });
}

class ServiceBDServiceMock {
  verificarContrasena = jasmine.createSpy('verificarContrasena').and.returnValue(Promise.resolve(true));
  modificarContrasena = jasmine.createSpy('modificarContrasena').and.returnValue(Promise.resolve());
}

describe('CambioContraPage', () => {
  let component: CambioContraPage;
  let fixture: ComponentFixture<CambioContraPage>;
  let routerMock: RouterMock;
  let activatedRouteMock: ActivatedRouteMock;
  let alertControllerMock: AlertControllerMock;
  let serviceBDMock: ServiceBDServiceMock;

  beforeEach(async () => {
    routerMock = new RouterMock();
    activatedRouteMock = new ActivatedRouteMock();
    alertControllerMock = new AlertControllerMock();
    serviceBDMock = new ServiceBDServiceMock();

    await TestBed.configureTestingModule({
      declarations: [CambioContraPage],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: ServiceBDService, useValue: serviceBDMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CambioContraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verifica que la validación sea correcta', () => {
    component.newPassword = 'Password@123';
    component.confirmPassword = 'Password@123';
    expect(component.validarContrasena()).toBeTrue();
  });

  it('verifica que la validación falle para contraseñas no coincidentes', () => {
    component.newPassword = 'Password@123';
    component.confirmPassword = 'Password@321';
    expect(component.validarContrasena()).toBeFalse();
  });

  it('verifica que se muestre un alerta cuando los campos están vacíos', async () => {
    component.currentPassword = '';
    await component.cambiarContrasena();

    expect(alertControllerMock.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Por favor complete todos los campos',
      buttons: ['OK'],
    });
  });

  it('verifica que se muestre un alerta cuando la contraseña actual es incorrecta', async () => {
    serviceBDMock.verificarContrasena.and.returnValue(Promise.resolve(false));
    component.currentPassword = 'WrongPassword';
    component.newPassword = 'Password@123';
    component.confirmPassword = 'Password@123';

    await component.cambiarContrasena();

    expect(serviceBDMock.verificarContrasena).toHaveBeenCalledWith(1, 'WrongPassword');
    expect(alertControllerMock.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'La contraseña actual es incorrecta',
      buttons: ['OK'],
    });
  });


  it('verifica los errores en la modificación de contraseña', async () => {
    serviceBDMock.modificarContrasena.and.returnValue(Promise.reject('Error de prueba'));

    component.currentPassword = 'CurrentPassword';
    component.newPassword = 'Password@123';
    component.confirmPassword = 'Password@123';

    await component.cambiarContrasena();

    expect(alertControllerMock.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Ocurrió un error al cambiar la contraseña',
      buttons: ['OK'],
    });
  });
});
