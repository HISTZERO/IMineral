import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmDonvihanhchinhListComponent } from './dcm-donvihanhchinh-list.component';

describe('DcmDonvihanhchinhListComponent', () => {
  let component: DcmDonvihanhchinhListComponent;
  let fixture: ComponentFixture<DcmDonvihanhchinhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcmDonvihanhchinhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcmDonvihanhchinhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
