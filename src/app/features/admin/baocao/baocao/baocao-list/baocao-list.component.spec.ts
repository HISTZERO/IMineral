/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaocaoListComponent } from './baocao-list.component';

describe('BaocaoListComponent', () => {
  let component: BaocaoListComponent;
  let fixture: ComponentFixture<BaocaoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaocaoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaocaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
