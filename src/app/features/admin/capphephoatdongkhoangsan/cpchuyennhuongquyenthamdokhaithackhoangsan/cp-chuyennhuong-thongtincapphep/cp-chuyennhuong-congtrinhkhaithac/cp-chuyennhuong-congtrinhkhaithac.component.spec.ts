import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpChuyennhuongCongtrinhkhaithacComponent } from './cp-chuyennhuong-congtrinhkhaithac.component';

describe('CpChuyennhuongCongtrinhkhaithacComponent', () => {
  let component: CpChuyennhuongCongtrinhkhaithacComponent;
  let fixture: ComponentFixture<CpChuyennhuongCongtrinhkhaithacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpChuyennhuongCongtrinhkhaithacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpChuyennhuongCongtrinhkhaithacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
