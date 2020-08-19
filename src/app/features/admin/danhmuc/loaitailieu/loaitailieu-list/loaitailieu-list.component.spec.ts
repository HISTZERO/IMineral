/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmLoaitailieuListComponent } from './loaitailieu-list.component';

describe('DmLoaitailieuListComponent', () => {
  let component: DmLoaitailieuListComponent;
  let fixture: ComponentFixture<DmLoaitailieuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmLoaitailieuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmLoaitailieuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
