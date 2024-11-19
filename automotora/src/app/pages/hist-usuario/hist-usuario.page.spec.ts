import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistUsuarioPage } from './hist-usuario.page';

describe('HistUsuarioPage', () => {
  let component: HistUsuarioPage;
  let fixture: ComponentFixture<HistUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
