/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmCaptruluongListComponent } from './captruluong-list.component';

describe('DmCaptruluongListComponent', () => {
  let component: DmCaptruluongListComponent;
  let fixture: ComponentFixture<DmCaptruluongListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmCaptruluongListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmCaptruluongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
