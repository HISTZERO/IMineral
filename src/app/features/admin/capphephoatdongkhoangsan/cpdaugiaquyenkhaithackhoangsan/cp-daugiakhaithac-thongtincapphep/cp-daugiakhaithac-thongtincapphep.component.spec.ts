import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDaugiakhaithacThongtincapphepComponent } from './cp-daugiakhaithac-thongtincapphep.component';

describe('CpDaugiakhaithacThongtincapphepComponent', () => {
  let component: CpDaugiakhaithacThongtincapphepComponent;
  let fixture: ComponentFixture<CpDaugiakhaithacThongtincapphepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpDaugiakhaithacThongtincapphepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpDaugiakhaithacThongtincapphepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
