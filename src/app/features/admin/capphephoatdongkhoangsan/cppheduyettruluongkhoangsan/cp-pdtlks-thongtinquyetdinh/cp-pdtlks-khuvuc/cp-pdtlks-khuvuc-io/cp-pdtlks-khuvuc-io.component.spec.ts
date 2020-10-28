import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpPdtlksKhuvucIoComponent } from './cp-pdtlks-khuvuc-io.component';

describe('CpPdtlksKhuvucIoComponent', () => {
  let component: CpPdtlksKhuvucIoComponent;
  let fixture: ComponentFixture<CpPdtlksKhuvucIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpPdtlksKhuvucIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpPdtlksKhuvucIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
