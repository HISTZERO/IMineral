/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KhuvucdutrukhoangsanIoComponent } from './khuvucdutrukhoangsan-io.component';

describe('KhuvucdutrukhoangsanIoComponent', () => {
  let component: KhuvucdutrukhoangsanIoComponent;
  let fixture: ComponentFixture<KhuvucdutrukhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucdutrukhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucdutrukhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
