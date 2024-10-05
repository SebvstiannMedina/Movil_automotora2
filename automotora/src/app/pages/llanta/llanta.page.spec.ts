import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LlantaPage } from './llanta.page';

describe('LlantaPage', () => {
  let component: LlantaPage;
  let fixture: ComponentFixture<LlantaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LlantaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
