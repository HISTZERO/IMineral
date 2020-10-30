import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpPdtlksKhoiluongComponent } from './cp-pdtlks-khoiluong.component';

describe('CpPdtlksKhoiluongComponent', () => {
  let component: CpPdtlksKhoiluongComponent;
  let fixture: ComponentFixture<CpPdtlksKhoiluongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpPdtlksKhoiluongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpPdtlksKhoiluongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
