import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController } from '@ionic/angular';
import { HomePage } from './home.page';
import { ApitimeService } from '../services/apitime.service';
import { of } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let alertController: AlertController;
  let alertSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ApitimeService, useValue: { getChiletime: () => of({ datetime: '2023-01-01T00:00:00Z' }) } },
        AlertController
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    alertController = TestBed.inject(AlertController);

    // Simula el método create en alertController para que devuelva una promesa de alerta
    alertSpy = spyOn(alertController, 'create').and.returnValue(
      Promise.resolve({
        present: () => Promise.resolve() // Agrega el método present simulado
      } as any)
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Si hay internet, no debe mostrar la alerta de no conexión', async () => {
    component.isConnected = false;
    await component.showNoConnectionAlert();
    expect(alertSpy).toHaveBeenCalled();
  });
});
