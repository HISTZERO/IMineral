import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonvihanhchinhIoComponent } from './donvihanhchinh-io.component';

describe('DonvihanhchinhIoComponent', () => {
  let component: DonvihanhchinhIoComponent;
  let fixture: ComponentFixture<DonvihanhchinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonvihanhchinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonvihanhchinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
