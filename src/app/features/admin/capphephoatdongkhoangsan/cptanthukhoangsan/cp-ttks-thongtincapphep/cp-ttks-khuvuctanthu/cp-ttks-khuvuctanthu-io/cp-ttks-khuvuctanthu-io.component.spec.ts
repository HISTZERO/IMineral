import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTtksKhuvuctanthuIoComponent } from './cp-ttks-khuvuctanthu-io.component';

describe('CpTtksKhuvuctanthuIoComponent', () => {
  let component: CpTtksKhuvuctanthuIoComponent;
  let fixture: ComponentFixture<CpTtksKhuvuctanthuIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTtksKhuvuctanthuIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTtksKhuvuctanthuIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
