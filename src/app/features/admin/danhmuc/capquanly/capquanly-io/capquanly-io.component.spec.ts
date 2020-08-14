/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CapquanlyIoComponent } from './capquanly-io.component';

describe('CapquanlyIoComponent', () => {
  let component: CapquanlyIoComponent;
  let fixture: ComponentFixture<CapquanlyIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapquanlyIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapquanlyIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
