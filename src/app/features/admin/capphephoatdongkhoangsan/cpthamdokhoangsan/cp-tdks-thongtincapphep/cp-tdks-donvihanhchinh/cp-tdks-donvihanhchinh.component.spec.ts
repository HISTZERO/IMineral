import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksDonvihanhchinhComponent } ./cp-tdks-donvihanhchinh.componenthinh.component';

describe('CpTdksDonvihanhchinhComponent', () => {
  let component: CpTdksDonvihanhchinhComponent;
  let fixture: ComponentFixture<CpTdksDonvihanhchinhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksDonvihanhchinhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksDonvihanhchinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
