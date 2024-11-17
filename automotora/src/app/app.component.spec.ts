import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from './service/service-bd.service';
import { AppComponent } from './app.component';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let mockRouter: any;
  let mockStorage: any;
  let mockAlertController: any;
  let mockBD: any;

  beforeEach(async () => {
    mockRouter = { events: of() }; // Simulación de eventos del Router
    mockStorage = { getItem: jasmine.createSpy().and.returnValue(Promise.resolve('Usuario Prueba')) };
    mockAlertController = { create: jasmine.createSpy().and.returnValue(Promise.resolve({ present: jasmine.createSpy() })) };
    mockBD = { dbState: jasmine.createSpy().and.returnValue(of(true)), fetchUsuario: jasmine.createSpy().and.returnValue(of(null)), cerrarSesion: jasmine.createSpy() };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: NativeStorage, useValue: mockStorage },
        { provide: AlertController, useValue: mockAlertController },
        { provide: ServiceBDService, useValue: mockBD },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('verifica que se actualiza el nombre del usuario', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    await app.ngOnInit();
    expect(mockStorage.getItem).toHaveBeenCalledWith('Nombre');
    expect(app.nombreUsuario).toBe('Usuario Prueba');
  });

  it('verifica que se oculta el menú cuando no sea el inicio', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.checkMenuVisibility('/login');
    expect(app.verMenu).toBeFalse();

    app.checkMenuVisibility('/home');
    expect(app.verMenu).toBeTrue();
  });

  it('verifica que se muestra un alerta al cerrar sesión', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    await app.logout();
    expect(mockAlertController.create).toHaveBeenCalled();
  });
});
