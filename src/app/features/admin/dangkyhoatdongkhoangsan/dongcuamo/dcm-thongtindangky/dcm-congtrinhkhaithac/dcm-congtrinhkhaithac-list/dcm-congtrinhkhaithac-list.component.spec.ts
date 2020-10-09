import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmCongtrinhkhaithacListComponent } from './dcm-congtrinhkhaithac-list.component';

describe('DcmCongtrinhkhaithacListComponent', () => {
  let component: DcmCongtrinhkhaithacListComponent;
  let fixture: ComponentFixture<DcmCongtrinhkhaithacListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcmCongtrinhkhaithacListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcmCongtrinhkhaithacListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
