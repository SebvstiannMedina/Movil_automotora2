import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApivaloresService } from './apivalores.service';

describe('ApivaloresService', () => {
  let service: ApivaloresService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApivaloresService],
    });
    service = TestBed.inject(ApivaloresService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('verifica que se puede obtener los valores del dólar y el euro', () => {
    const mockResponse = {
      version: '1.0',
      autor: 'mindicador.cl',
      dolar: {
        codigo: 'dolar',
        nombre: 'Dólar observado',
        unidad_medida: 'Pesos',
        fecha: '2024-11-16',
        valor: 850.75,
      },
      euro: {
        codigo: 'euro',
        nombre: 'Euro',
        unidad_medida: 'Pesos',
        fecha: '2024-11-16',
        valor: 950.25,
      },
    };

    service.getValores().subscribe((data) => {
      expect(data).toBeTruthy();
      expect(data.dolar).toBeDefined();
      expect(data.dolar.valor).toBe(850.75);
      expect(data.euro).toBeDefined();
      expect(data.euro.valor).toBe(950.25);
    });

    const req = httpMock.expectOne('https://mindicador.cl/api');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Simula la respuesta de la API
  });

  it('verifica que se produce un error cuando la API devuelve un error', () => {
    const mockError = {
      status: 500,
      statusText: 'Internal Server Error',
    };

    service.getValores().subscribe({
      next: () => fail('Expected an error, not data'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      },
    });

    const req = httpMock.expectOne('https://mindicador.cl/api');
    req.flush(null, mockError); // Simula un error de la API
  });
});
