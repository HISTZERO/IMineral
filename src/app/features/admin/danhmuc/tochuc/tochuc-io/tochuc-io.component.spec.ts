/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TochucIoComponent } from './tochuc-io.component';

describe('TochucIoComponent', () => {
  let component: TochucIoComponent;
  let fixture: ComponentFixture<TochucIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TochucIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TochucIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
