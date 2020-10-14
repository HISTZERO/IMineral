import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksCongtrinhthamdoIoComponent } from './cp-tdks-congtrinhthamdo-io.component';

describe('CpTdksCongtrinhthamdoIoComponent', () => {
  let component: CpTdksCongtrinhthamdoIoComponent;
  let fixture: ComponentFixture<CpTdksCongtrinhthamdoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksCongtrinhthamdoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksCongtrinhthamdoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
