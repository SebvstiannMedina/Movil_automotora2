import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoCompraPage } from './carrito-compra.page';

describe('CarritoCompraPage', () => {
  let component: CarritoCompraPage;
  let fixture: ComponentFixture<CarritoCompraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritoCompraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
