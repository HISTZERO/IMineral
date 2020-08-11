/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CapquanlyListComponent } from './capquanly-list.component';

describe('CapquanlyListComponent', () => {
  let component: CapquanlyListComponent;
  let fixture: ComponentFixture<CapquanlyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapquanlyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapquanlyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
