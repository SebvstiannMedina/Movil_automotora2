import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApitimeService } from './apitime.service';

describe('ApitimeService', () => {
  let service: ApitimeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApitimeService]
    });
    service = TestBed.inject(ApitimeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes HTTP pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('verica que se puede obtener la hora actual', () => {
    const mockResponse = {
      abbreviation: 'CLST',
      datetime: '2024-11-16T12:00:00-03:00',
      timezone: 'America/Santiago',
      utc_offset: '-03:00'
    };

    service.getChiletime().subscribe((data: any) => {
      expect(data).toBeTruthy();
      expect(data.timezone).toBe('America/Santiago');
      expect(data.abbreviation).toBe('CLST');
    });

    const req = httpMock.expectOne('https://worldtimeapi.org/api/timezone/America/Santiago');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Simula la respuesta de la API
  });

  it('verifica que se produce un error cuando la API devuelve un error', () => {
    const mockError = {
      status: 404,
      statusText: 'Not Found'
    };

    service.getChiletime().subscribe({
      next: () => fail('Expected an error, not data'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    });

    const req = httpMock.expectOne('https://worldtimeapi.org/api/timezone/America/Santiago');
    req.flush(null, mockError); // Simula un error de la API
  });
});
