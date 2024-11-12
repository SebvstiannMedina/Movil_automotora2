import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { VerPerfilPage } from './ver-perfil.page';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ChangeDetectorRef } from '@angular/core';

describe('VerPerfilPage', () => {
  let component: VerPerfilPage;
  let fixture: ComponentFixture<VerPerfilPage>;
  let bdServiceSpy: jasmine.SpyObj<ServiceBDService>;
  let storageSpy: jasmine.SpyObj<NativeStorage>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const bdSpy = jasmine.createSpyObj('ServiceBDService', ['searchUserById']);
    const storage = jasmine.createSpyObj('NativeStorage', ['getItem']);
    const cdr = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      declarations: [VerPerfilPage],
      providers: [
        { provide: ServiceBDService, useValue: bdSpy },
        { provide: NativeStorage, useValue: storage },
        { provide: ChangeDetectorRef, useValue: cdr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerPerfilPage);
    component = fixture.componentInstance;
    bdServiceSpy = TestBed.inject(ServiceBDService) as jasmine.SpyObj<ServiceBDService>;
    storageSpy = TestBed.inject(NativeStorage) as jasmine.SpyObj<NativeStorage>;
    cdrSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
