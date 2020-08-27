/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KhuvuckhoangsandochaiDulieuComponent } from './khuvuckhoangsandochai-dulieu.component';

describe('KhuvuckhoangsandochaiDulieuComponent', () => {
  let component: KhuvuckhoangsandochaiDulieuComponent;
  let fixture: ComponentFixture<KhuvuckhoangsandochaiDulieuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuckhoangsandochaiDulieuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuckhoangsandochaiDulieuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
