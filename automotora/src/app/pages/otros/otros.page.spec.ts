import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtrosPage } from './otros.page';

describe('OtrosPage', () => {
  let component: OtrosPage;
  let fixture: ComponentFixture<OtrosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OtrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
