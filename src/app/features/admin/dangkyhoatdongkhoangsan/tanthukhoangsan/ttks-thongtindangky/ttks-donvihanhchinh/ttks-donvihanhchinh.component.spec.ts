import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtksDonvihanhchinhComponent } from './ttks-donvihanhchinh.component';

describe('TtksDonvihanhchinhComponent', () => {
  let component: TtksDonvihanhchinhComponent;
  let fixture: ComponentFixture<TtksDonvihanhchinhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtksDonvihanhchinhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtksDonvihanhchinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
