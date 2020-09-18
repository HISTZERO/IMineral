/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DangkykhaithacgiahanIoComponent } from './dangkykhaithacgiahan-io.component';

describe('DangkykhaithacgiahanIoComponent', () => {
  let component: DangkykhaithacgiahanIoComponent;
  let fixture: ComponentFixture<DangkykhaithacgiahanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkykhaithacgiahanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkykhaithacgiahanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
