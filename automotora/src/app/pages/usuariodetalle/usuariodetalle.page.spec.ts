import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariodetallePage } from './usuariodetalle.page';

describe('UsuariodetallePage', () => {
  let component: UsuariodetallePage;
  let fixture: ComponentFixture<UsuariodetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariodetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
