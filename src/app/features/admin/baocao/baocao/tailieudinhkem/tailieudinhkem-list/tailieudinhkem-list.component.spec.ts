/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TailieudinhkemListComponent } from './tailieudinhkem-list.component';

describe('TailieudinhkemListComponent', () => {
  let component: TailieudinhkemListComponent;
  let fixture: ComponentFixture<TailieudinhkemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TailieudinhkemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TailieudinhkemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
