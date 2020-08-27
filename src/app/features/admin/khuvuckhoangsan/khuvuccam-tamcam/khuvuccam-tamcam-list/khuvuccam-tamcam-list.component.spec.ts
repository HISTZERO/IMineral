/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KhuvuccamTamcamListComponent } from './khuvuccam-tamcam-list.component';

describe('KhuvuccamTamcamListComponent', () => {
  let component: KhuvuccamTamcamListComponent;
  let fixture: ComponentFixture<KhuvuccamTamcamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuccamTamcamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuccamTamcamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
