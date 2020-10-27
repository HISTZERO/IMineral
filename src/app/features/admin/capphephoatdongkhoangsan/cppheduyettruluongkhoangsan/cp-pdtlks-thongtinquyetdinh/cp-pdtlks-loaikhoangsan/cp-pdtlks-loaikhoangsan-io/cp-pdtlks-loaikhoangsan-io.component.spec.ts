import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpPdtlksLoaikhoangsanIoComponent } from './cp-pdtlks-loaikhoangsan-io.component';

describe('CpPdtlksLoaikhoangsanIoComponent', () => {
  let component: CpPdtlksLoaikhoangsanIoComponent;
  let fixture: ComponentFixture<CpPdtlksLoaikhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpPdtlksLoaikhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpPdtlksLoaikhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
