import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpPdtlksThongtinquyetdinhComponent } from './cp-pdtlks-thongtinquyetdinh.component';

describe('CpPdtlksThongtinquyetdinhComponent', () => {
  let component: CpPdtlksThongtinquyetdinhComponent;
  let fixture: ComponentFixture<CpPdtlksThongtinquyetdinhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpPdtlksThongtinquyetdinhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpPdtlksThongtinquyetdinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
