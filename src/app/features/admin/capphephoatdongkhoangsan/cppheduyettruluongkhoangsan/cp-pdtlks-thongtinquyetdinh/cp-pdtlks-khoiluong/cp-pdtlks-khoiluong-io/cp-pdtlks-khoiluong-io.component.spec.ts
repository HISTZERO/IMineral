import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpPdtlksKhoiluongIoComponent } from './cp-pdtlks-khoiluong-io.component';

describe('CpPdtlksKhoiluongIoComponent', () => {
  let component: CpPdtlksKhoiluongIoComponent;
  let fixture: ComponentFixture<CpPdtlksKhoiluongIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpPdtlksKhoiluongIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpPdtlksKhoiluongIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
