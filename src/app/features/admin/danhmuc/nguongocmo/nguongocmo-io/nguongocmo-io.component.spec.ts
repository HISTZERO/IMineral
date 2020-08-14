/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NguongocmoIoComponent } from './nguongocmo-io.component';

describe('NguongocmoIoComponent', () => {
  let component: NguongocmoIoComponent;
  let fixture: ComponentFixture<NguongocmoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NguongocmoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NguongocmoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
