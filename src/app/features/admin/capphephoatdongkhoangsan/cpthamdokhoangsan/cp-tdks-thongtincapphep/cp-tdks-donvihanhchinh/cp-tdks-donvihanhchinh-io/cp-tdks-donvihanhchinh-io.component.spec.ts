import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksDonvihanhchinhIoComponent } from './cp-tdks-donvihanhchinh-io.component';

describe('CpTdksDonvihanhchinhIoComponent', () => {
  let component: CpTdksDonvihanhchinhIoComponent;
  let fixture: ComponentFixture<CpTdksDonvihanhchinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksDonvihanhchinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksDonvihanhchinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
