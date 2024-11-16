import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperaContraPage } from './recupera-contra.page';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { of } from 'rxjs';

class RouterMock {
  navigate = jasmine.createSpy('navigate');
}

class AlertControllerMock {
  create = jasmine.createSpy('create').and.returnValue({
    present: jasmine.createSpy('present'),
  });
}

class ServiceBDServiceMock {
  buscarUsuarioPorCorreo = jasmine.createSpy('buscarUsuarioPorCorreo').and.returnValue(
    Promise.resolve({ 
      preguntaSeleccionada: '¿Cuál es tu animal favorito?', 
      respuestaSeguridad: 'gato' 
    })
  );
  modificarContrasena2 = jasmine.createSpy('modificarContrasena2').and.returnValue(Promise.resolve());
}

describe('RecuperaContraPage', () => {
  let component: RecuperaContraPage;
  let fixture: ComponentFixture<RecuperaContraPage>;
  let serviceBDMock: ServiceBDServiceMock;
  let alertControllerMock: AlertControllerMock;
  let routerMock: RouterMock;

  beforeEach(async () => {
    serviceBDMock = new ServiceBDServiceMock();
    alertControllerMock = new AlertControllerMock();
    routerMock = new RouterMock();

    await TestBed.configureTestingModule({
      declarations: [RecuperaContraPage],
      providers: [
        { provide: ServiceBDService, useValue: serviceBDMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperaContraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('busca la pregunta de seguridad del usuario', async () => {
    component.correo = 'test@example.com';
    await component.buscarUsuario();

    expect(serviceBDMock.buscarUsuarioPorCorreo).toHaveBeenCalledWith('test@example.com');
    expect(component.usuarioEncontrado).toEqual({
      preguntaSeleccionada: '¿Cuál es tu animal favorito?',
      respuestaSeguridad: 'gato',
    });
    expect(component.preguntaSeguridad).toBe('¿Cuál es tu animal favorito?');
    expect(component.paso).toBe(2);
  });

  it('verifica si el paso tres esta correcto', async () => {
    component.usuarioEncontrado = {
      preguntaSeleccionada: '¿Cuál es tu animal favorito?',
      respuestaSeguridad: 'gato',
    };
    component.preguntaSeguridad = '¿Cuál es tu animal favorito?';
    component.preguntaSeleccionada = '¿Cuál es tu animal favorito?';
    component.respuestaUsuario = 'gato';

    await component.verificarRespuesta();

    expect(component.paso).toBe(3);
  });

  it('prueba respuesta incorrecta', async () => {
    component.usuarioEncontrado = {
      preguntaSeleccionada: '¿Cuál es tu animal favorito?',
      respuestaSeguridad: 'gato',
    };
    component.preguntaSeguridad = '¿Cuál es tu animal favorito?';
    component.preguntaSeleccionada = '¿Cuál es tu animal favorito?';
    component.respuestaUsuario = 'perro';

    await component.verificarRespuesta();

    expect(component.paso).toBe(1); // No avanza al siguiente paso
    expect(alertControllerMock.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Respuesta incorrecta',
      buttons: ['OK'],
    });
  });

  it('al ccambiar la contraseña te envia al login', async () => {
    component.correo = 'test@example.com';
    component.nuevaContrasena = 'NuevaContrasena1!';
    component.confirmarContrasena = 'NuevaContrasena1!';

    spyOn(component, 'validarContrasenas').and.returnValue(true);

    await component.cambiarContrasena();

    expect(serviceBDMock.modificarContrasena2).toHaveBeenCalledWith('test@example.com', 'NuevaContrasena1!');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(alertControllerMock.create).toHaveBeenCalledWith({
      header: 'Éxito',
      message: 'Contraseña actualizada correctamente',
      buttons: ['OK'],
    });
  });
});
