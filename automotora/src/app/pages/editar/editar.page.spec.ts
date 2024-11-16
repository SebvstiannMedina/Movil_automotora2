import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPage } from './editar.page';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Camera } from '@capacitor/camera';
import { of } from 'rxjs';

// Mock del servicio ServiceBDService
class MockServiceBDService {
  dbState() { return of(true); }
  fetchCategoria() { return of([{ id: 1, nombre: 'Categoria 1' }]); }
  modificarCrud() { return of(null); }
}

describe('EditarPage', () => {
  let component: EditarPage;
  let fixture: ComponentFixture<EditarPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: ServiceBDService, useClass: MockServiceBDService },
        Camera
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
