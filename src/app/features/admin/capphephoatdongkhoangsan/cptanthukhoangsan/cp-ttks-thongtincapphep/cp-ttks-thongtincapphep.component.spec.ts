import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTtksThongtincapphepComponent } from './cp-ttks-thongtincapphep.component';

describe('CpTtksThongtincapphepComponent', () => {
  let component: CpTtksThongtincapphepComponent;
  let fixture: ComponentFixture<CpTtksThongtincapphepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTtksThongtincapphepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTtksThongtincapphepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
