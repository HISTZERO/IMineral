import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdtlThongtinchitietComponent } from './pdtl-thongtinchitiet.component';

describe('PdtlThongtinchitietComponent', () => {
  let component: PdtlThongtinchitietComponent;
  let fixture: ComponentFixture<PdtlThongtinchitietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdtlThongtinchitietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdtlThongtinchitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
