/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TailieudinhkemIoComponent } from './tailieudinhkem-io.component';

describe('TailieudinhkemIoComponent', () => {
  let component: TailieudinhkemIoComponent;
  let fixture: ComponentFixture<TailieudinhkemIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TailieudinhkemIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TailieudinhkemIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
