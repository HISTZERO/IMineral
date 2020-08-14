/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoaitochucIoComponent } from './loaitochuc-io.component';

describe('LoaitochucIoComponent', () => {
  let component: LoaitochucIoComponent;
  let fixture: ComponentFixture<LoaitochucIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaitochucIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaitochucIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
