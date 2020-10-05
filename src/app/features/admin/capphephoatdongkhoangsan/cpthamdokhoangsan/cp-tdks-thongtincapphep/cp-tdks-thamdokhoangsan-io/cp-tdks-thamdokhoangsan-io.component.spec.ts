import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksThamdokhoangsanIoComponent } from './cp-tdks-thamdokhoangsan-io.component';

describe('CpTdksThamdokhoangsanIoComponent', () => {
  let component: CpTdksThamdokhoangsanIoComponent;
  let fixture: ComponentFixture<CpTdksThamdokhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksThamdokhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksThamdokhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
