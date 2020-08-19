/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmTochucIoComponent } from './tochuc-io.component';

describe('DmTochucIoComponent', () => {
  let component: DmTochucIoComponent;
  let fixture: ComponentFixture<DmTochucIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmTochucIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmTochucIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
