/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TochucListComponent } from './tochuc-list.component';

describe('TochucListComponent', () => {
  let component: TochucListComponent;
  let fixture: ComponentFixture<TochucListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TochucListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TochucListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
