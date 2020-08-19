/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmLoaibaocaoListComponent } from './loaibaocao-list.component';

describe('DmLoaibaocaoListComponent', () => {
  let component: DmLoaibaocaoListComponent;
  let fixture: ComponentFixture<DmLoaibaocaoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmLoaibaocaoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmLoaibaocaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
