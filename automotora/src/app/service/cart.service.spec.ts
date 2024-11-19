import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { ServiceBDService } from './service-bd.service';
import { of } from 'rxjs';

describe('CartService', () => {
  let service: CartService;
  let mockServiceBD: jasmine.SpyObj<ServiceBDService>;

  beforeEach(() => {
    // Crear un mock para el servicio ServiceBDService
    mockServiceBD = jasmine.createSpyObj('ServiceBDService', ['insertarVenta', 'insertarDetalle', 'database']);
    
    // Configurar valores simulados para los métodos del servicio
    mockServiceBD.insertarVenta.and.returnValue(Promise.resolve()); // Simula una inserción exitosa
    mockServiceBD.insertarDetalle.and.returnValue(Promise.resolve()); // Simula una inserción exitosa

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: ServiceBDService, useValue: mockServiceBD }
      ]
    });

    service = TestBed.inject(CartService);

    // Hacer que los métodos del servicio que interactúan con el localStorage estén simulados
    spyOn(localStorage, 'getItem').and.returnValue(null);  // Simula que no hay carrito guardado
    spyOn(localStorage, 'setItem');  // Simula la escritura en localStorage
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
