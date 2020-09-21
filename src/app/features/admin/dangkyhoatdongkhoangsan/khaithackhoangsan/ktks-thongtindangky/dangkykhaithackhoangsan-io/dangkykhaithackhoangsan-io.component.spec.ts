/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DangkykhaithackhoangsanIoComponent } from './dangkykhaithackhoangsan-io.component';

describe('DangkykhaithackhoangsanIoComponent', () => {
  let component: DangkykhaithackhoangsanIoComponent;
  let fixture: ComponentFixture<DangkykhaithackhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkykhaithackhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkykhaithackhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
