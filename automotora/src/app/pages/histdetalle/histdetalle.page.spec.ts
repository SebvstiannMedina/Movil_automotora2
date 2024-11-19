import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistdetallePage } from './histdetalle.page';

describe('HistdetallePage', () => {
  let component: HistdetallePage;
  let fixture: ComponentFixture<HistdetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistdetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
