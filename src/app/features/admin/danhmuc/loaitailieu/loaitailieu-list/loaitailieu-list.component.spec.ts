/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoaitailieuListComponent } from './loaitailieu-list.component';

describe('LoaitailieuListComponent', () => {
  let component: LoaitailieuListComponent;
  let fixture: ComponentFixture<LoaitailieuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaitailieuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaitailieuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
