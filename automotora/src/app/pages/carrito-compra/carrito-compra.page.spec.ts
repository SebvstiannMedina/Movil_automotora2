import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoCompraPage } from './carrito-compra.page';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para servicios HTTP
import { IonicModule } from '@ionic/angular'; // Para Ionic
import { RouterTestingModule } from '@angular/router/testing'; // Para rutas
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Para formularios
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // SQLite Mock
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // NativeStorage Mock
import { CartService } from 'src/app/service/cart.service'; // Servicio del carrito
import { ServiceBDService } from 'src/app/service/service-bd.service'; // Servicio de la base de datos
import { of } from 'rxjs'; // Para simulación de observables

describe('CarritoCompraPage', () => {
  let component: CarritoCompraPage;
  let fixture: ComponentFixture<CarritoCompraPage>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockServiceBD: jasmine.SpyObj<ServiceBDService>;
  let mockNativeStorage: jasmine.SpyObj<NativeStorage>;

  beforeEach(async () => {
    // Crear mocks para servicios
    mockCartService = jasmine.createSpyObj('CartService', ['getCartItems', 'setCurrentUser', 'updateQuantity', 'removeFromCart', 'clearCart', 'checkout']);
    mockServiceBD = jasmine.createSpyObj('ServiceBDService', ['searchUserById']);
    mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem']);

    // Configurar valores simulados para los métodos mock
    mockCartService.getCartItems.and.returnValue(of([])); // Devuelve un carrito vacío
    mockServiceBD.searchUserById.and.returnValue(Promise.resolve({ nombre: 'Usuario', correo: 'Usuario@gmail.com' }));
    mockNativeStorage.getItem.and.returnValue(Promise.resolve('1')); // ID de usuario como string

    await TestBed.configureTestingModule({
      declarations: [CarritoCompraPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: ServiceBDService, useValue: mockServiceBD },
        { provide: NativeStorage, useValue: mockNativeStorage },
        SQLite, // SQLite se puede mantener como dependencia si no necesitas mockearlo
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoCompraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Verifica si el usuario esta logueado y carga el carrito correctamente', async () => {
    await component.ionViewWillEnter();
    expect(component.id_user).toBe(1);
    expect(component.username).toBe('Usuario');
    expect(component.email).toBe('Usuario@gmail.com');
    expect(component.cartItems.length).toBe(0); 
  });
});
