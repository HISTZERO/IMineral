import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTtksLoaikhoangsanListComponent } from './cp-ttks-loaikhoangsan-list.component';

describe('CpTtksLoaikhoangsanListComponent', () => {
  let component: CpTtksLoaikhoangsanListComponent;
  let fixture: ComponentFixture<CpTtksLoaikhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTtksLoaikhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTtksLoaikhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
