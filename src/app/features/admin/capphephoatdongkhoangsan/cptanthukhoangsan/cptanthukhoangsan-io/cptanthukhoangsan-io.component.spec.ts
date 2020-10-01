import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CptanthukhoangsanIoComponent  } from './cptanthukhoangsan-io.component';

describe('CptanthukhoangsanIoComponent', () => {
  let component: CptanthukhoangsanIoComponent;
  let fixture: ComponentFixture<CptanthukhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptanthukhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptanthukhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
