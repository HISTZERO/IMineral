import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtksDonvihanhchinhIoComponent } from './ktks-donvihanhchinh-io.component';

describe('KtksDonvihanhchinhIoComponent', () => {
  let component: KtksDonvihanhchinhIoComponent;
  let fixture: ComponentFixture<KtksDonvihanhchinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtksDonvihanhchinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtksDonvihanhchinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
