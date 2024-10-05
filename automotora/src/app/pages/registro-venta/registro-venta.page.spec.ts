import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroVentaPage } from './registro-venta.page';

describe('RegistroVentaPage', () => {
  let component: RegistroVentaPage;
  let fixture: ComponentFixture<RegistroVentaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroVentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
