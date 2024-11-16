import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApivaloresPage } from './apivalores.page';
import { ApivaloresService } from '../../services/apivalores.service';
import { of } from 'rxjs';  // Importa `of` para simular un Observable

describe('ApivaloresPage', () => {
  let component: ApivaloresPage;
  let fixture: ComponentFixture<ApivaloresPage>;
  let apivaloresServiceMock: jasmine.SpyObj<ApivaloresService>;

  beforeEach(() => {
    // Crea un mock del servicio ApivaloresService
    apivaloresServiceMock = jasmine.createSpyObj('ApivaloresService', ['getValores']);
    
    // Configura el valor que devolverá el mock cuando se llame a `getValores()`
    apivaloresServiceMock.getValores.and.returnValue(of({
      dolar: { valor: 100 },
      euro: { valor: 90 }
    }));

    TestBed.configureTestingModule({
      declarations: [ ApivaloresPage ],
      providers: [
        { provide: ApivaloresService, useValue: apivaloresServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApivaloresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Detecta los cambios para que se ejecute `ngOnInit()`
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('asignar valores a las variables dolar y euro', () => {
    expect(component.dolar).toBe(100);
    expect(component.euro).toBe(90);
  });
});
