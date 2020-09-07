/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaocaoDieutrakhaosatListComponent } from './baocao-dieutrakhaosat-list.component';

describe('BaocaoDieutrakhaosatListComponent', () => {
  let component: BaocaoDieutrakhaosatListComponent;
  let fixture: ComponentFixture<BaocaoDieutrakhaosatListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaocaoDieutrakhaosatListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaocaoDieutrakhaosatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
