import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpChuyennhuongThongtincapphepComponent } from './cp-chuyennhuong-thongtincapphep.component';

describe('CpChuyennhuongThongtincapphepComponent', () => {
  let component: CpChuyennhuongThongtincapphepComponent;
  let fixture: ComponentFixture<CpChuyennhuongThongtincapphepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpChuyennhuongThongtincapphepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpChuyennhuongThongtincapphepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
