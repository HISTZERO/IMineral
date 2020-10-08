import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksDonvihanhchinhListComponent } from './cp-tdks-donvihanhchinh-list.component';

describe('CpTdksDonvihanhchinhListComponent', () => {
  let component: CpTdksDonvihanhchinhListComponent;
  let fixture: ComponentFixture<CpTdksDonvihanhchinhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksDonvihanhchinhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksDonvihanhchinhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
