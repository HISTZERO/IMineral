import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksCongtrinhkhaithacListComponent } from './cp-ktks-congtrinhkhaithac-list.component';

describe('CpKtksCongtrinhkhaithacListComponent', () => {
  let component: CpKtksCongtrinhkhaithacListComponent;
  let fixture: ComponentFixture<CpKtksCongtrinhkhaithacListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksCongtrinhkhaithacListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksCongtrinhkhaithacListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
