import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { UsuariodetallePage } from './usuariodetalle.page';

describe('UsuariodetallePage', () => {
  let component: UsuariodetallePage;
  let fixture: ComponentFixture<UsuariodetallePage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    
    await TestBed.configureTestingModule({
      declarations: [UsuariodetallePage],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariodetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verifica que se llama al método dismiss del modal', () => {
    component.dismiss();
    expect(modalControllerSpy.dismiss).toHaveBeenCalled();
  });
});
