import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosPage } from './productos.page';
import { IonicModule } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { CartService } from 'src/app/service/cart.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; // Para simular las rutas

describe('ProductosPage', () => {
  let component: ProductosPage;
  let fixture: ComponentFixture<ProductosPage>;
  let mockServiceBD: jasmine.SpyObj<ServiceBDService>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    // Crear mocks para los servicios
    mockServiceBD = jasmine.createSpyObj('ServiceBDService', ['dbState', 'fetchCategoria', 'fetchCrud']);
    mockCartService = jasmine.createSpyObj('CartService', ['addToCart']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['queryParams']);

    // Configurar valores simulados para los métodos del servicio
    mockServiceBD.dbState.and.returnValue(of(true)); // Simula que la base de datos está lista
    mockServiceBD.fetchCategoria.and.returnValue(of([{ idCategoria: 1, nomCateg: 'Categoria 1' }])); // Simula categorías

    // Simular parámetros de la URL

    await TestBed.configureTestingModule({
      declarations: [ProductosPage],
      imports: [IonicModule.forRoot(), RouterTestingModule], // Necesario para simular rutas
      providers: [
        { provide: ServiceBDService, useValue: mockServiceBD },
        { provide: CartService, useValue: mockCartService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
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
