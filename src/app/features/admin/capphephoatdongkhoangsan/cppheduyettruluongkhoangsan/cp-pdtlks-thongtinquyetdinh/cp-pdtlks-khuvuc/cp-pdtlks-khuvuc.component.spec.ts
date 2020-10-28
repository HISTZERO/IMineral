import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpPdtlksKhuvucComponent } from './cp-pdtlks-khuvuc.component';

describe('CpPdtlksKhuvucComponent', () => {
  let component: CpPdtlksKhuvucComponent;
  let fixture: ComponentFixture<CpPdtlksKhuvucComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpPdtlksKhuvucComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpPdtlksKhuvucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
