/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoaibaocaoListComponent } from './loaibaocao-list.component';

describe('LoaibaocaoListComponent', () => {
  let component: LoaibaocaoListComponent;
  let fixture: ComponentFixture<LoaibaocaoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaibaocaoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaibaocaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
