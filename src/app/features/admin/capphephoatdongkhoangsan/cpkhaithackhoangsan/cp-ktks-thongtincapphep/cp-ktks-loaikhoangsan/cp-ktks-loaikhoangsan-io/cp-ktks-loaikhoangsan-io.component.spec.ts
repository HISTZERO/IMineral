import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksLoaikhoangsanIoComponent } from './cp-ktks-loaikhoangsan-io.component';

describe('CpKtksLoaikhoangsanIoComponent', () => {
  let component: CpKtksLoaikhoangsanIoComponent;
  let fixture: ComponentFixture<CpKtksLoaikhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksLoaikhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksLoaikhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
