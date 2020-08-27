/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KhuvuccamTamcamChitietComponent } from './khuvuccam-tamcam-chitiet.component';

describe('KhuvuccamTamcamChitietComponent', () => {
  let component: KhuvuccamTamcamChitietComponent;
  let fixture: ComponentFixture<KhuvuccamTamcamChitietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuccamTamcamChitietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuccamTamcamChitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
