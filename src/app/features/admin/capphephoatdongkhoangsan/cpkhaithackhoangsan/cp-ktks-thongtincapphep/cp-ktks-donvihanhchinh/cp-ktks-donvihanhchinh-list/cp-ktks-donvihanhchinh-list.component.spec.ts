import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksDonvihanhchinhListComponent } from './cp-ktks-donvihanhchinh-list.component';

describe('CpKtksDonvihanhchinhListComponent', () => {
  let component: CpKtksDonvihanhchinhListComponent;
  let fixture: ComponentFixture<CpKtksDonvihanhchinhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksDonvihanhchinhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksDonvihanhchinhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
