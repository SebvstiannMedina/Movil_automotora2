import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NosotrosPage } from './nosotros.page';

describe('NosotrosPage', () => {
  let component: NosotrosPage;
  let fixture: ComponentFixture<NosotrosPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NosotrosPage],
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('verifica que el componente se inicializa correctamente', () => {
    expect(component.ngOnInit).toBeDefined();
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('verofica que el componente se actualiza correctamente', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled).toBeTruthy();
  });


});
