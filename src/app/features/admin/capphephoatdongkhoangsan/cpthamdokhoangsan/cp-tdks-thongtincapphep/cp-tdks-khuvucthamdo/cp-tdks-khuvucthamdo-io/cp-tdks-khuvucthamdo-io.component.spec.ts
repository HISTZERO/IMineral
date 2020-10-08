import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksKhuvucthamdoIoComponent } from './cp-tdks-khuvucthamdo-io.component';

describe('CpTdksKhuvucthamdoIoComponent', () => {
  let component: CpTdksKhuvucthamdoIoComponent;
  let fixture: ComponentFixture<CpTdksKhuvucthamdoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksKhuvucthamdoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksKhuvucthamdoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
