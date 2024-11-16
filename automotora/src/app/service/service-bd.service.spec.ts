import { TestBed } from '@angular/core/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router } from '@angular/router';
import { ServiceBDService } from './service-bd.service';

describe('ServiceBDService', () => {
  let service: ServiceBDService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SQLite,
        AlertController,
        Platform,
        NativeStorage,
        Router
      ]
    });
    service = TestBed.inject(ServiceBDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
