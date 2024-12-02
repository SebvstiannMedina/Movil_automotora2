import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditarPerfilPage } from './editar-perfil.page';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { of } from 'rxjs';

describe('EditarPerfilPage', () => {
  let component: EditarPerfilPage;
  let fixture: ComponentFixture<EditarPerfilPage>;
  let alertController: AlertController;
  let serviceBDService: jasmine.SpyObj<ServiceBDService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const serviceSpy = jasmine.createSpyObj('ServiceBDService', ['modificarUsuario']);

    TestBed.configureTestingModule({
      declarations: [EditarPerfilPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        AlertController,
        { 
          provide: ActivatedRoute, 
          useValue: { 
            queryParams: of({}),
            snapshot: { params: {} }
          } 
        },
        { provide: ServiceBDService, useValue: serviceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPerfilPage);
    component = fixture.componentInstance;

    component.user = {
      nombre: 'Angel',
      correo: 'angel@gmail.com',
      imagen: 'any',
      idusuario: 1
    };

    alertController = TestBed.inject(AlertController);
    serviceBDService = TestBed.inject(ServiceBDService) as jasmine.SpyObj<ServiceBDService>;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verifica que se valide un nombre válido', () => {
    component.user.nombre = 'Ana';
    expect(component.validarNombre()).toBeTrue();
  });

  it('verifica que no se valide un nombre inválido', () => {
    component.user.nombre = 'Ana123';
    expect(component.validarNombre()).toBeFalse();
  });

  it('verifica que se muestre un alerta cuando no hay cambios', async () => {
    spyOn(alertController, 'create').and.callThrough();
    component.user.nombre = '';

    await component.presentAlert();

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'No hay nada que editar',
      buttons: ['OK'],
    });
  });



  it('verifica que se navegue a cambio-contra con los datos del usuario', () => {
    spyOn(router, 'navigate');
    component.irACambioContrasena();

    expect(router.navigate).toHaveBeenCalledWith(['/cambio-contra'], {
      state: { user: component.user },
    });
  });


});
