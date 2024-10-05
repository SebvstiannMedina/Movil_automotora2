import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AeromatizantesPage } from './aeromatizantes.page';

describe('AeromatizantesPage', () => {
  let component: AeromatizantesPage;
  let fixture: ComponentFixture<AeromatizantesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AeromatizantesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
