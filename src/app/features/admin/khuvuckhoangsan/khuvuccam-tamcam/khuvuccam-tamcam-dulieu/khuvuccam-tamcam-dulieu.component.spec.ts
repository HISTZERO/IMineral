/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KhuvuccamTamcamDulieuComponent } from './khuvuccam-tamcam-dulieu.component';

describe('KhuvuccamTamcamDulieuComponent', () => {
  let component: KhuvuccamTamcamDulieuComponent;
  let fixture: ComponentFixture<KhuvuccamTamcamDulieuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuccamTamcamDulieuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuccamTamcamDulieuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
