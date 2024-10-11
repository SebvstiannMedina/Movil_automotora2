import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApivaloresPage } from './apivalores.page';

describe('ApivaloresPage', () => {
  let component: ApivaloresPage;
  let fixture: ComponentFixture<ApivaloresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApivaloresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
