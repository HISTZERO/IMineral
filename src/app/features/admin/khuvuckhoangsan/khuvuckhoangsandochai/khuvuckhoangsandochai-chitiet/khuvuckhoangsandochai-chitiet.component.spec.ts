/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KhuvuckhoangsandochaiChitietComponent } from './khuvuckhoangsandochai-chitiet.component';

describe('KhuvuckhoangsandochaiChitietComponent', () => {
  let component: KhuvuckhoangsandochaiChitietComponent;
  let fixture: ComponentFixture<KhuvuckhoangsandochaiChitietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuckhoangsandochaiChitietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuckhoangsandochaiChitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
