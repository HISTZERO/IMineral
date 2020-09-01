/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KhuvucdutrukhoangsanListComponent } from './khuvucdutrukhoangsan-list.component';

describe('KhuvucdutrukhoangsanListComponent', () => {
  let component: KhuvucdutrukhoangsanListComponent;
  let fixture: ComponentFixture<KhuvucdutrukhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucdutrukhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucdutrukhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
