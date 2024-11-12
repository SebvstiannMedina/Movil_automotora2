import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule, AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { BehaviorSubject } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let serviceBDService: jasmine.SpyObj<ServiceBDService>;
  let storageSpy: jasmine.SpyObj<NativeStorage>;

  beforeEach(waitForAsync(() => {
    const serviceSpy = jasmine.createSpyObj('ServiceBDService', ['validarCredenciales', 'guardarTipoStorage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    storageSpy = jasmine.createSpyObj('NativeStorage', ['getItem', 'setItem', 'clear']);
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    const navSpy = jasmine.createSpyObj('NavController', ['navigateForward']);

    // Configurar el comportamiento del storage spy
    storageSpy.getItem.and.returnValue(Promise.resolve(null));
    storageSpy.setItem.and.returnValue(Promise.resolve());
    storageSpy.clear.and.returnValue(Promise.resolve());

    // Crear BehaviorSubject para isDBReady
    serviceSpy.isDBReady = new BehaviorSubject<boolean>(true);

    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiceBDService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NativeStorage, useValue: storageSpy },
        { provide: AlertController, useValue: alertSpy },
        { provide: NavController, useValue: navSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    serviceBDService = TestBed.inject(ServiceBDService) as jasmine.SpyObj<ServiceBDService>;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Validar el correo y la contrasena', () => {
    component.objetoLogin = { correo: 'test@test.com', contrasena: 'Test12345*' };
    serviceBDService.validarCredenciales.and.returnValue(Promise.resolve(true));
    component.login();
    expect(serviceBDService.validarCredenciales).toHaveBeenCalledWith('test@test.com', 'Test12345*');
  });
});