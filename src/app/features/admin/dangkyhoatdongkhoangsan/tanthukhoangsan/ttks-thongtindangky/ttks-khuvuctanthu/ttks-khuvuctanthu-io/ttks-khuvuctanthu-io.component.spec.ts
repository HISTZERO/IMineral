import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtksKhuvuctanthuIoComponent } from './ttks-khuvuctanthu-io.component';

describe('TtksKhuvuctanthuIoComponent', () => {
  let component: TtksKhuvuctanthuIoComponent;
  let fixture: ComponentFixture<TtksKhuvuctanthuIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtksKhuvuctanthuIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtksKhuvuctanthuIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
