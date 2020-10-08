import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksCongtrinhthamdoComponent } ./cp-tdks-congtrinhthamdo.componentamdo.component';

describe('CpTdksCongtrinhthamdoComponent', () => {
  let component: CpTdksCongtrinhthamdoComponent;
  let fixture: ComponentFixture<CpTdksCongtrinhthamdoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksCongtrinhthamdoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksCongtrinhthamdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
