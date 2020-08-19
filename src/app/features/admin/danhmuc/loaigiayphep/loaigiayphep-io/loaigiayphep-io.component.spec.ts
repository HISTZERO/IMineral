/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmLoaigiayphepIoComponent } from './loaigiayphep-io.component';

describe('DmLoaigiayphepIoComponent', () => {
  let component: DmLoaigiayphepIoComponent;
  let fixture: ComponentFixture<DmLoaigiayphepIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmLoaigiayphepIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmLoaigiayphepIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
