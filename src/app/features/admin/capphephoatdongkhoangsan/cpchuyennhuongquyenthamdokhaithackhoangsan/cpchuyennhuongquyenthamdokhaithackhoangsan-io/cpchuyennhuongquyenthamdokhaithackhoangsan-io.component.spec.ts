import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpchuyennhuongquyenthamdokhaithackhoangsanIoComponent } from './cpchuyennhuongquyenthamdokhaithackhoangsan-io.component';

describe('CpchuyennhuongquyenthamdokhaithackhoangsanIoComponent', () => {
  let component: CpchuyennhuongquyenthamdokhaithackhoangsanIoComponent;
  let fixture: ComponentFixture<CpchuyennhuongquyenthamdokhaithackhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpchuyennhuongquyenthamdokhaithackhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpchuyennhuongquyenthamdokhaithackhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
