import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksLoaikhoangsanIoComponent } from './cp-tdks-cp-tdks-loaikhoangsan-io.component';

describe('CpTdksLoaikhoangsanIoComponent', () => {
  let component: CpTdksLoaikhoangsanIoComponent;
  let fixture: ComponentFixture<CpTdksLoaikhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksLoaikhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksLoaikhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
