import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistUsuarioPage } from './hist-usuario.page';
import { IonicModule } from '@ionic/angular'; 
import { RouterTestingModule } from '@angular/router/testing'; 
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { of } from 'rxjs'; 

describe('HistUsuarioPage', () => {
  let component: HistUsuarioPage;
  let fixture: ComponentFixture<HistUsuarioPage>;
  let mockServiceBD: jasmine.SpyObj<ServiceBDService>;

  beforeEach(async () => {
  
    mockServiceBD = jasmine.createSpyObj('ServiceBDService', ['dbState', 'fetchUsuario']);
    
    mockServiceBD.dbState.and.returnValue(of(true));
    mockServiceBD.fetchUsuario.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [HistUsuarioPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        { provide: ServiceBDService, useValue: mockServiceBD }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})