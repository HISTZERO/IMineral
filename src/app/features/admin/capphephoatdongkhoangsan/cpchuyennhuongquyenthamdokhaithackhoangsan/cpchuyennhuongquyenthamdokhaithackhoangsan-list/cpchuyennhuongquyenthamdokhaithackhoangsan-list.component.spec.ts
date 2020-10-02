import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpchuyennhuongquyenthamdokhaithackhoangsanListComponent } from './cpchuyennhuongquyenthamdokhaithackhoangsan-list.component';

describe('CpchuyennhuongquyenthamdokhaithackhoangsanListComponent', () => {
  let component: CpchuyennhuongquyenthamdokhaithackhoangsanListComponent;
  let fixture: ComponentFixture<CpchuyennhuongquyenthamdokhaithackhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpchuyennhuongquyenthamdokhaithackhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpchuyennhuongquyenthamdokhaithackhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
