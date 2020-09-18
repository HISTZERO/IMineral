import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonvihanhchinhComponent } from './donvihanhchinh.component';

describe('DonvihanhchinhComponent', () => {
  let component: DonvihanhchinhComponent;
  let fixture: ComponentFixture<DonvihanhchinhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonvihanhchinhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonvihanhchinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
