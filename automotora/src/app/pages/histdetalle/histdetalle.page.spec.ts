import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { HistdetallePage } from './histdetalle.page';

describe('HistdetallePage', () => {
  let component: HistdetallePage;
  let fixture: ComponentFixture<HistdetallePage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      declarations: [HistdetallePage],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(HistdetallePage);
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
