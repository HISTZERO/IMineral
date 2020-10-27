import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpPdtlksLoaikhoangsanComponent } from './cp-pdtlks-loaikhoangsan.component';

describe('CpPdtlksLoaikhoangsanComponent', () => {
  let component: CpPdtlksLoaikhoangsanComponent;
  let fixture: ComponentFixture<CpPdtlksLoaikhoangsanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpPdtlksLoaikhoangsanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpPdtlksLoaikhoangsanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
