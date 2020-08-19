/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmTochucListComponent } from './tochuc-list.component';

describe('DmTochucListComponent', () => {
  let component: DmTochucListComponent;
  let fixture: ComponentFixture<DmTochucListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmTochucListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmTochucListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
