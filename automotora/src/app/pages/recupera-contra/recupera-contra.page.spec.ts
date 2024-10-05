import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperaContraPage } from './recupera-contra.page';

describe('RecuperaContraPage', () => {
  let component: RecuperaContraPage;
  let fixture: ComponentFixture<RecuperaContraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperaContraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
