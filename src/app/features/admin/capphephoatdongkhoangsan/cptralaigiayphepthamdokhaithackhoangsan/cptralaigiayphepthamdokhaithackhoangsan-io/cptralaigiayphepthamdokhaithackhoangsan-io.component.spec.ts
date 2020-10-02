import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptralaigiayphepthamdokhaithackhoangsanIoComponent } from './cptralaigiayphepthamdokhaithackhoangsan-io.component';

describe('CptralaigiayphepthamdokhaithackhoangsanIoComponent', () => {
  let component: CptralaigiayphepthamdokhaithackhoangsanIoComponent;
  let fixture: ComponentFixture<CptralaigiayphepthamdokhaithackhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptralaigiayphepthamdokhaithackhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptralaigiayphepthamdokhaithackhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
