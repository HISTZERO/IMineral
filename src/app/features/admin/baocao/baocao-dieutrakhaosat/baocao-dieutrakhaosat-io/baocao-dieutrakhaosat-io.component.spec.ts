/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaocaoDieutrakhaosatIoComponent } from './baocao-dieutrakhaosat-io.component';

describe('BaocaoDieutrakhaosatIoComponent', () => {
  let component: BaocaoDieutrakhaosatIoComponent;
  let fixture: ComponentFixture<BaocaoDieutrakhaosatIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaocaoDieutrakhaosatIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaocaoDieutrakhaosatIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
