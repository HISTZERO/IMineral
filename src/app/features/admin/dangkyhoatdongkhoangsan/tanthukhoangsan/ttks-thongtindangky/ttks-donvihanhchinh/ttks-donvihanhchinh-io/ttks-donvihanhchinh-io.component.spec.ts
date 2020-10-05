import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtksDonvihanhchinhIoComponent } from './ttks-donvihanhchinh-io.component';

describe('TtksDonvihanhchinhIoComponent', () => {
  let component: TtksDonvihanhchinhIoComponent;
  let fixture: ComponentFixture<TtksDonvihanhchinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtksDonvihanhchinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtksDonvihanhchinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
