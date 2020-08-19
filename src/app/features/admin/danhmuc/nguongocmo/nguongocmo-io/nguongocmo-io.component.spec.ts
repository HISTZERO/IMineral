/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmNguongocmoIoComponent } from './nguongocmo-io.component';

describe('DmNguongocmoIoComponent', () => {
  let component: DmNguongocmoIoComponent;
  let fixture: ComponentFixture<DmNguongocmoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmNguongocmoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmNguongocmoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
