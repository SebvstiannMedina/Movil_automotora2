import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoCompraPage } from './carrito-compra.page';
import { IonicModule } from '@ionic/angular';
import { CartService } from 'src/app/service/cart.service';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('CarritoCompraPage', () => {
  let component: CarritoCompraPage;
  let fixture: ComponentFixture<CarritoCompraPage>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockBDService: jasmine.SpyObj<ServiceBDService>;
  let mockNativeStorage: jasmine.SpyObj<NativeStorage>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create mock services
    mockCartService = jasmine.createSpyObj('CartService', [
      'getCartItems', 
      'updateQuantity', 
      'removeFromCart', 
      'clearCart', 
      'setCurrentUser',
      'getTotal',
      'checkout'
    ]);
    mockBDService = jasmine.createSpyObj('ServiceBDService', [
      'fetchCrud', 
      'searchUserById'
    ]);
    mockNativeStorage = jasmine.createSpyObj('NativeStorage', ['getItem']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Configure mock return values
    mockCartService.getCartItems.and.returnValue(of([]));
    mockBDService.fetchCrud.and.returnValue(of([]));
    mockBDService.searchUserById.and.returnValue(Promise.resolve({}));
    mockNativeStorage.getItem.and.returnValue(Promise.resolve(1)); // Default user ID
    mockCartService.getTotal.and.returnValue(0);

    await TestBed.configureTestingModule({
      declarations: [CarritoCompraPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: ServiceBDService, useValue: mockBDService },
        { provide: NativeStorage, useValue: mockNativeStorage },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoCompraPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('verifica que el total del carrito sea el correcto', () => {
    const total = 50;
    mockCartService.getTotal.and.returnValue(total);

    const result = component.getTotal();

    expect(result).toBe(total);
  });


});