import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AeromatizantesPage } from './aeromatizantes.page';
import { CartService } from 'src/app/service/cart.service';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { of } from 'rxjs'; 

class CartServiceMock {
  getCartItems() {
    return of([]); // Simular un carrito vacío
  }

  setCurrentUser(userId: number) {
    return of(true);
  }

  updateQuantity(id: number, quantity: number) {
    return of(true);
  }

  removeFromCart(id: number) {
    return of(true);
  }

  clearCart() {
    return of(true);
  }

  checkout() {
    return of(true);
  }

  getTotal() {
    return 0;
  }
}

class ServiceBDServiceMock {
  searchUserById(userId: number) {
    return of({ nombre: 'John Doe', correo: 'john.doe@example.com' });
  }
}

class NativeStorageMock {
  getItem(key: string) {
    return of('1'); // Simular un ID de usuario almacenado
  }
}

describe('AeromatizantesPage', () => {
  let component: AeromatizantesPage;
  let fixture: ComponentFixture<AeromatizantesPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AeromatizantesPage],
      providers: [
        { provide: CartService, useClass: CartServiceMock },
        { provide: ServiceBDService, useClass: ServiceBDServiceMock },
        { provide: NativeStorage, useClass: NativeStorageMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AeromatizantesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
