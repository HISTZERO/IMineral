/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoaicapphepListComponent } from './loaicapphep-list.component';

describe('LoaicapphepListComponent', () => {
  let component: LoaicapphepListComponent;
  let fixture: ComponentFixture<LoaicapphepListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaicapphepListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaicapphepListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
