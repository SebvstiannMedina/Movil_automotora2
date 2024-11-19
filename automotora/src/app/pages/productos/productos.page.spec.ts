import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosPage } from './productos.page';
import { IonicModule } from '@ionic/angular'; // Necesario para Ionic
import { ServiceBDService } from 'src/app/service/service-bd.service'; // Servicio de BD
import { CartService } from 'src/app/service/cart.service'; // Servicio de carrito
import { of } from 'rxjs'; // Para simular observables

describe('ProductosPage', () => {
  let component: ProductosPage;
  let fixture: ComponentFixture<ProductosPage>;
  let mockServiceBD: jasmine.SpyObj<ServiceBDService>;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    // Crear mocks para los servicios
    mockServiceBD = jasmine.createSpyObj('ServiceBDService', ['dbState', 'fetchCategoria', 'fetchCrud']);
    mockCartService = jasmine.createSpyObj('CartService', ['addToCart']);

    // Configurar valores simulados para los métodos del servicio
    mockServiceBD.dbState.and.returnValue(of(true)); // Simula que la base de datos está lista
    mockServiceBD.fetchCategoria.and.returnValue(of([{ idCategoria: 1, nomCateg: 'Categoria 1' }])); // Simula categorías
    
    await TestBed.configureTestingModule({
      declarations: [ProductosPage],
      imports: [IonicModule.forRoot()], // Módulo necesario para Ionic
      providers: [
        { provide: ServiceBDService, useValue: mockServiceBD }, // Reemplazar servicio real por el mock
        { provide: CartService, useValue: mockCartService }, // Reemplazar servicio real por el mock
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
