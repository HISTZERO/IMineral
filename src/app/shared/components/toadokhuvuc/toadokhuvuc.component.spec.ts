/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ToadokhuvucComponent } from './toadokhuvuc.component';

describe('ToadokhuvucComponent', () => {
  let component: ToadokhuvucComponent;
  let fixture: ComponentFixture<ToadokhuvucComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToadokhuvucComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToadokhuvucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
