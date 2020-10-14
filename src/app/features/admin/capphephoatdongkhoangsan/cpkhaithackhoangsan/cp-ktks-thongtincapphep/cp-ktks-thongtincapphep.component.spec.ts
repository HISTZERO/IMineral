import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksThongtincapphepComponent } from './cp-ktks-thongtincapphep.component';

describe('CpKtksThongtincapphepComponent', () => {
  let component: CpKtksThongtincapphepComponent;
  let fixture: ComponentFixture<CpKtksThongtincapphepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksThongtincapphepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksThongtincapphepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
