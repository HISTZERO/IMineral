import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTtksDonvihanhchinhListComponent } from './cp-ttks-donvihanhchinh-list.component';

describe('CpTtksDonvihanhchinhListComponent', () => {
  let component: CpTtksDonvihanhchinhListComponent;
  let fixture: ComponentFixture<CpTtksDonvihanhchinhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTtksDonvihanhchinhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTtksDonvihanhchinhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
