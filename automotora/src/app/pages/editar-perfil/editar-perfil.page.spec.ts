import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditarPerfilPage } from './editar-perfil.page';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { of } from 'rxjs';

describe('EditarPerfilPage', () => {
  let component: EditarPerfilPage;
  let fixture: ComponentFixture<EditarPerfilPage>;
  let alertController: AlertController;
  let serviceBDService: jasmine.SpyObj<ServiceBDService>;

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
    
    // Inicializa 'usuario' con un objeto predeterminado
    component.usuario = {
      nombre: 'Angel',
      correo: 'angel@gmail.com',
      imagen: 'any',
      id: 1
    };
    
    alertController = TestBed.inject(AlertController);
    serviceBDService = TestBed.inject(ServiceBDService) as jasmine.SpyObj<ServiceBDService>;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('VAlidar que el nombre sea valido', () => {
    component.usuario.nombre = 'Ana123';
    expect(component.validarNombre()).toBeFalse();
    component.usuario.nombre = 'Ana';
    expect(component.validarNombre()).toBeTrue();
  });
  
});