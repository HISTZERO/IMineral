import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTtksLoaikhoangsanIoComponent } from './cp-ttks-loaikhoangsan-io.component';

describe('CpTtksLoaikhoangsanIoComponent', () => {
  let component: CpTtksLoaikhoangsanIoComponent;
  let fixture: ComponentFixture<CpTtksLoaikhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTtksLoaikhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTtksLoaikhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
