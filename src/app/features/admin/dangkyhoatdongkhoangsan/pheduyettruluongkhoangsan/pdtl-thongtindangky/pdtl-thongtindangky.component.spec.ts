import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdtlThongtindangkyComponent } from './pdtl-thongtindangky.component';

describe('PdtlThongtindangkyComponent', () => {
  let component: PdtlThongtindangkyComponent;
  let fixture: ComponentFixture<PdtlThongtindangkyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdtlThongtindangkyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdtlThongtindangkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
