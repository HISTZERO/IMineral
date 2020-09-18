import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonvihanhchinhListComponent } from './donvihanhchinh-list.component';

describe('DonvihanhchinhListComponent', () => {
  let component: DonvihanhchinhListComponent;
  let fixture: ComponentFixture<DonvihanhchinhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonvihanhchinhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonvihanhchinhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
