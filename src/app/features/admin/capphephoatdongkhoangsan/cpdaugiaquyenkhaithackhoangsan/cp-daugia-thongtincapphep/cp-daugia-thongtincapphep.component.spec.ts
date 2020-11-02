import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDaugiaThongtincapphepComponent } from './cp-daugia-thongtincapphep.component';

describe('CpDaugiaThongtincapphepComponent', () => {
  let component: CpDaugiaThongtincapphepComponent;
  let fixture: ComponentFixture<CpDaugiaThongtincapphepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpDaugiaThongtincapphepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpDaugiaThongtincapphepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
