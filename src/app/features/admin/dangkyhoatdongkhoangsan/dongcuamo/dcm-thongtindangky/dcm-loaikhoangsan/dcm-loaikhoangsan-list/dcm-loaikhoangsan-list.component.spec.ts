import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmLoaikhoangsanListComponent } from './dcm-loaikhoangsan-list.component';

describe('DcmLoaikhoangsanListComponent', () => {
  let component: DcmLoaikhoangsanListComponent;
  let fixture: ComponentFixture<DcmLoaikhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcmLoaikhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcmLoaikhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
