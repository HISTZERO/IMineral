/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NguongocmoListComponent } from './nguongocmo-list.component';

describe('NguongocmoListComponent', () => {
  let component: NguongocmoListComponent;
  let fixture: ComponentFixture<NguongocmoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NguongocmoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NguongocmoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
