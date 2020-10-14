import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksLoaikhoangsanListComponent } from './cp-ktks-loaikhoangsan-list.component';

describe('CpKtksLoaikhoangsanListComponent', () => {
  let component: CpKtksLoaikhoangsanListComponent;
  let fixture: ComponentFixture<CpKtksLoaikhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksLoaikhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksLoaikhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
