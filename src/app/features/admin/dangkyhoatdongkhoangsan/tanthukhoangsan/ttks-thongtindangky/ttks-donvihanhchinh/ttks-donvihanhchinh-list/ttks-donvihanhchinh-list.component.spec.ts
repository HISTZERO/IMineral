import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtksDonvihanhchinhListComponent } from './ttks-donvihanhchinh-list.component';

describe('TtksDonvihanhchinhListComponent', () => {
  let component: TtksDonvihanhchinhListComponent;
  let fixture: ComponentFixture<TtksDonvihanhchinhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtksDonvihanhchinhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtksDonvihanhchinhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
