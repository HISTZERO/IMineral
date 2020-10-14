import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmDonvihanhchinhIoComponent } from './dcm-donvihanhchinh-io.component';

describe('DcmDonvihanhchinhIoComponent', () => {
  let component: DcmDonvihanhchinhIoComponent;
  let fixture: ComponentFixture<DcmDonvihanhchinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcmDonvihanhchinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcmDonvihanhchinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
