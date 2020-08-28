/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ThongtinkhuvuckhoangsanComponent } from './thongtinkhuvuckhoangsan.component';

describe('ThongtinkhuvuckhoangsanComponent', () => {
  let component: ThongtinkhuvuckhoangsanComponent;
  let fixture: ComponentFixture<ThongtinkhuvuckhoangsanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThongtinkhuvuckhoangsanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongtinkhuvuckhoangsanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
