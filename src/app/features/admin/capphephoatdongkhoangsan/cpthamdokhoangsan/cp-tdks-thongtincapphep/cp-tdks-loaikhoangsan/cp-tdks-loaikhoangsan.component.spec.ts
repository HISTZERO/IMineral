import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksLoaikhoangsanComponent } from './cp-tdks-loaikhoangsan.component';

describe('CpTdksLoaikhoangsanComponent', () => {
  let component: CpTdksLoaikhoangsanComponent;
  let fixture: ComponentFixture<CpTdksLoaikhoangsanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksLoaikhoangsanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksLoaikhoangsanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
