import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtksDonvihanhchinhListComponent } from './ktks-donvihanhchinh-list.component';

describe('KtksDonvihanhchinhListComponent', () => {
  let component: KtksDonvihanhchinhListComponent;
  let fixture: ComponentFixture<KtksDonvihanhchinhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtksDonvihanhchinhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtksDonvihanhchinhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
