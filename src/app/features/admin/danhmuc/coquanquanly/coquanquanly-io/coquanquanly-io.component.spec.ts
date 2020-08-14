/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoquanquanlyIoComponent } from './coquanquanly-io.component';

describe('CoquanquanlyIoComponent', () => {
  let component: CoquanquanlyIoComponent;
  let fixture: ComponentFixture<CoquanquanlyIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoquanquanlyIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoquanquanlyIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
