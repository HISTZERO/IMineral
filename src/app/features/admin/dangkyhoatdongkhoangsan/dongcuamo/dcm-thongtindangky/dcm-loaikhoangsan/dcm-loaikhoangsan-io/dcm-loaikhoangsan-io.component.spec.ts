import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmLoaikhoangsanIoComponent } from './dcm-loaikhoangsan-io.component';

describe('DcmLoaikhoangsanIoComponent', () => {
  let component: DcmLoaikhoangsanIoComponent;
  let fixture: ComponentFixture<DcmLoaikhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcmLoaikhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcmLoaikhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
