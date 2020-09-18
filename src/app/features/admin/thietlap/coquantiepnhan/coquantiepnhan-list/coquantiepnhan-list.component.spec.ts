/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoquantiepnhanListComponent } from './coquantiepnhan-list.component';

describe('CoquantiepnhanListComponent', () => {
  let component: CoquantiepnhanListComponent;
  let fixture: ComponentFixture<CoquantiepnhanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoquantiepnhanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoquantiepnhanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
