/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmThutuchanhchinhIoComponent } from './thutuchanhchinh-io.component';

describe('DmThutuchanhchinhIoComponent', () => {
  let component: DmThutuchanhchinhIoComponent;
  let fixture: ComponentFixture<DmThutuchanhchinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmThutuchanhchinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmThutuchanhchinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
