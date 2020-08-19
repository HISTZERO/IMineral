/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmCapquanlyListComponent } from './capquanly-list.component';

describe('DmCapquanlyListComponent', () => {
  let component: DmCapquanlyListComponent;
  let fixture: ComponentFixture<DmCapquanlyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmCapquanlyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmCapquanlyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
