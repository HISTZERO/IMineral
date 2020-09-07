/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaocaoDieutrakhaosatDetailComponent } from './baocao-dieutrakhaosat-detail.component';

describe('BaocaoDieutrakhaosatDetailComponent', () => {
  let component: BaocaoDieutrakhaosatDetailComponent;
  let fixture: ComponentFixture<BaocaoDieutrakhaosatDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaocaoDieutrakhaosatDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaocaoDieutrakhaosatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
