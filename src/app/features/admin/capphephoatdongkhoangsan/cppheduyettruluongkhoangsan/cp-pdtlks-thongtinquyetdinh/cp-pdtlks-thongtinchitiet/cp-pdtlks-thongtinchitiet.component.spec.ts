import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpPdtlksThongtinchitietComponent } from './cp-pdtlks-thongtinchitiet.component';

describe('CpPdtlksThongtinchitietComponent', () => {
  let component: CpPdtlksThongtinchitietComponent;
  let fixture: ComponentFixture<CpPdtlksThongtinchitietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpPdtlksThongtinchitietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpPdtlksThongtinchitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
