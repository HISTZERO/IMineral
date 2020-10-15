import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTtksTanthukhoangsanIoComponent } from './cp-ttks-tanthukhoangsan-io.component';

describe('CpTtksTanthukhoangsanIoComponent', () => {
  let component: CpTtksTanthukhoangsanIoComponent;
  let fixture: ComponentFixture<CpTtksTanthukhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTtksTanthukhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTtksTanthukhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
