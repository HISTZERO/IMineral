/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmNguongocmoListComponent } from './nguongocmo-list.component';

describe('DmNguongocmoListComponent', () => {
  let component: DmNguongocmoListComponent;
  let fixture: ComponentFixture<DmNguongocmoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmNguongocmoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmNguongocmoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
