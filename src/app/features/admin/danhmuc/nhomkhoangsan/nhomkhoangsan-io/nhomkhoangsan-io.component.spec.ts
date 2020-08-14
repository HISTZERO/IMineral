/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NhomkhoangsanIoComponent } from './nhomkhoangsan-io.component';

describe('NhomkhoangsanIoComponent', () => {
  let component: NhomkhoangsanIoComponent;
  let fixture: ComponentFixture<NhomkhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhomkhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhomkhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
