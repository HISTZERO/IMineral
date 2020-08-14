/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CaptruluongListComponent } from './captruluong-list.component';

describe('CaptruluongListComponent', () => {
  let component: CaptruluongListComponent;
  let fixture: ComponentFixture<CaptruluongListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptruluongListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptruluongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
