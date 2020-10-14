import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksCongtrinhthamdoListComponent } ./cp-tdks-congtrinhthamdo-list.componentlist.component';

describe('CpTdksCongtrinhthamdoListComponent', () => {
  let component: CpTdksCongtrinhthamdoListComponent;
  let fixture: ComponentFixture<CpTdksCongtrinhthamdoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksCongtrinhthamdoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksCongtrinhthamdoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
