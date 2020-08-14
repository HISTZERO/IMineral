/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ThutuchanhchinhIoComponent } from './thutuchanhchinh-io.component';

describe('ThutuchanhchinhIoComponent', () => {
  let component: ThutuchanhchinhIoComponent;
  let fixture: ComponentFixture<ThutuchanhchinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThutuchanhchinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThutuchanhchinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
