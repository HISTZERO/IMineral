import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksDonvihanhchinhIoComponent } from './cp-ktks-donvihanhchinh-io.component';

describe('CpKtksDonvihanhchinhIoComponent', () => {
  let component: CpKtksDonvihanhchinhIoComponent;
  let fixture: ComponentFixture<CpKtksDonvihanhchinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksDonvihanhchinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksDonvihanhchinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
