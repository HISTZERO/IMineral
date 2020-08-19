/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmThutuchanhchinhListComponent } from './thutuchanhchinh-list.component';

describe('DmThutuchanhchinhListComponent', () => {
  let component: DmThutuchanhchinhListComponent;
  let fixture: ComponentFixture<DmThutuchanhchinhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmThutuchanhchinhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmThutuchanhchinhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
