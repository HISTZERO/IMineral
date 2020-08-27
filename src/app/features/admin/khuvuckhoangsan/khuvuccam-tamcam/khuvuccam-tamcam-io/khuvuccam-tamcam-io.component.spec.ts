/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KhuvuccamTamcamIoComponent } from './khuvuccam-tamcam-io.component';

describe('KhuvuccamTamcamIoComponent', () => {
  let component: KhuvuccamTamcamIoComponent;
  let fixture: ComponentFixture<KhuvuccamTamcamIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuccamTamcamIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuccamTamcamIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
