import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtksDonvihanhchinhComponent } from './ktks-donvihanhchinh.component';

describe('KtksDonvihanhchinhComponent', () => {
  let component: KtksDonvihanhchinhComponent;
  let fixture: ComponentFixture<KtksDonvihanhchinhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtksDonvihanhchinhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtksDonvihanhchinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
