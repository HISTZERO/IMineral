import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksThongtincapphepComponent } from './cp-tdks-thongtincapphep.component';

describe('CpTdksThongtincapphepComponent', () => {
  let component: CpTdksThongtincapphepComponent;
  let fixture: ComponentFixture<CpTdksThongtincapphepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksThongtincapphepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksThongtincapphepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
