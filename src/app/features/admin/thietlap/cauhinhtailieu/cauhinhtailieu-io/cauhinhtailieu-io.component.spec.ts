/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CauhinhtailieuIoComponent } from './cauhinhtailieu-io.component';

describe('CauhinhtailieuIoComponent', () => {
  let component: CauhinhtailieuIoComponent;
  let fixture: ComponentFixture<CauhinhtailieuIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauhinhtailieuIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauhinhtailieuIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
