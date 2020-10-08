import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksLoaikhoangsanListComponent } from './cp-tdks-loaikhoangsan-list.component';

describe('CpTdksLoaikhoangsanListComponent', () => {
  let component: CpTdksLoaikhoangsanListComponent;
  let fixture: ComponentFixture<CpTdksLoaikhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksLoaikhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksLoaikhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
