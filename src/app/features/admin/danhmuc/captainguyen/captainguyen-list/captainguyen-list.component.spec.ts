/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmCaptainguyenListComponent } from './captainguyen-list.component';

describe('DmCaptainguyenListComponent', () => {
  let component: DmCaptainguyenListComponent;
  let fixture: ComponentFixture<DmCaptainguyenListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmCaptainguyenListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmCaptainguyenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
