/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KhuvuckhongdaugiaChitietComponent } from './khuvuckhongdaugia-chitiet.component';

describe('KhuvuckhongdaugiaChitietComponent', () => {
  let component: KhuvuckhongdaugiaChitietComponent;
  let fixture: ComponentFixture<KhuvuckhongdaugiaChitietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuckhongdaugiaChitietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuckhongdaugiaChitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
