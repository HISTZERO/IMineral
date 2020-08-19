/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmCoquanquanlyListComponent } from './coquanquanly-list.component';

describe('DmCoquanquanlyListComponent', () => {
  let component: DmCoquanquanlyListComponent;
  let fixture: ComponentFixture<DmCoquanquanlyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmCoquanquanlyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmCoquanquanlyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
