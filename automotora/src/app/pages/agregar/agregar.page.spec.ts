import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AgregarPage } from './agregar.page';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Camera } from '@capacitor/camera';

describe('AgregarPage', () => {
  let component: AgregarPage;
  let fixture: ComponentFixture<AgregarPage>;
  let alertController: jasmine.SpyObj<AlertController>;
  let serviceBDService: jasmine.SpyObj<ServiceBDService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    const serviceSpy = jasmine.createSpyObj('ServiceBDService', ['insertarCrud', 'dbState', 'fetchCategoria']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [AgregarPage],
      providers: [
        { provide: AlertController, useValue: alertSpy },
        { provide: ServiceBDService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarPage);
    component = fixture.componentInstance;

    alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    serviceBDService = TestBed.inject(ServiceBDService) as jasmine.SpyObj<ServiceBDService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Simula el estado de la base de datos y categorías
    serviceBDService.dbState.and.returnValue(of(true));
    serviceBDService.fetchCategoria.and.returnValue(of([{ idCategoria: 1, nomCateg: 'Categoría 1' }]));

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verfica que se cargan las categorías al estado de la base de datos', () => {
    component.cargarCategorias();
    expect(serviceBDService.fetchCategoria).toHaveBeenCalled();
    expect(component.categorias).toEqual([{ idCategoria: 1, nomCateg: 'Categoría 1' }]);
  });


  it('verifica que se valide precio correctamente', () => {
    const event = { target: { value: '1500.50' } };
    component.validarPrecio(event);
    expect(component.mensajeError).toBe('');
    expect(component.precio).toBe(1500.5);
  });

  it('verifica que se valide precio con letras', () => {
    const event = { target: { value: 'abc' } };
    component.validarPrecio(event);
    expect(component.mensajeError).toBe('Solo se permiten números');
  });

  it('verifica que se valide precio menor a 1000', () => {
    const event = { target: { value: '500' } };
    component.validarPrecio(event);
    expect(component.mensajeError).toBe('El precio no puede ser menor a 1000');
  });

  it('verifica que se valide precio con más de dos decimales', () => {
    const event = { target: { value: '1500.123' } };
    component.validarPrecio(event);
    expect(component.mensajeError).toBe('Solo se permiten dos decimales');
  });

  it('verifica que se muestre un alerta con éxito cuando todos los campos son válidos', async () => {
    component.nombre = 'Producto';
    component.descripcion = 'Descripción';
    component.precio = 1500;
    component.categoriaSeleccionada = 1;

    alertController.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present'),
    } as any));

    await component.presentAlert();

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Éxito',
      message: 'El producto fue agregado exitosamente.',
      buttons: jasmine.any(Array),
    });
  });

  it('verifica que se muestre un alerta cuando los campos están incompletos', async () => {
    component.nombre = '';
    component.descripcion = '';
    component.precio = 0;
    component.categoriaSeleccionada = 0;

    alertController.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present'),
    } as any));

    await component.presentAlert();

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Todos los campos son obligatorios',
      buttons: ['Volver'],
    });
  });




});
