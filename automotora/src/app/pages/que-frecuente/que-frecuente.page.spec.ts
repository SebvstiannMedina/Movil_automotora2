import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueFrecuentePage } from './que-frecuente.page';

describe('QueFrecuentePage', () => {
  let component: QueFrecuentePage;
  let fixture: ComponentFixture<QueFrecuentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QueFrecuentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
