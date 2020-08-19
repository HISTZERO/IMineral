/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmCoquanquanlyIoComponent } from './coquanquanly-io.component';

describe('DmCoquanquanlyIoComponent', () => {
  let component: DmCoquanquanlyIoComponent;
  let fixture: ComponentFixture<DmCoquanquanlyIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmCoquanquanlyIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmCoquanquanlyIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
