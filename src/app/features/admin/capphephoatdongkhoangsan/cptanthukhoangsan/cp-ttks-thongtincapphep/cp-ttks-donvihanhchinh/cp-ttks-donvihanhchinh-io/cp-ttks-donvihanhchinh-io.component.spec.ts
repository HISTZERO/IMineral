import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTtksDonvihanhchinhIoComponent } from './cp-ttks-donvihanhchinh-io.component';

describe('CpTtksDonvihanhchinhIoComponent', () => {
  let component: CpTtksDonvihanhchinhIoComponent;
  let fixture: ComponentFixture<CpTtksDonvihanhchinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTtksDonvihanhchinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTtksDonvihanhchinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
