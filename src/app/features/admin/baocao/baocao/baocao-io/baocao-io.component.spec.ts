/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaocaoIoComponent } from './baocao-io.component';

describe('BaocaoIoComponent', () => {
  let component: BaocaoIoComponent;
  let fixture: ComponentFixture<BaocaoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaocaoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaocaoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
