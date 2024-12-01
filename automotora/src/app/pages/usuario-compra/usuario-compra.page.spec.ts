import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioCompraPage } from './usuario-compra.page';

describe('UsuarioCompraPage', () => {
  let component: UsuarioCompraPage;
  let fixture: ComponentFixture<UsuarioCompraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioCompraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
