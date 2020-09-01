/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KhuvucdutrukhoangsanChitietComponent } from './khuvucdutrukhoangsan-chitiet.component';

describe('KhuvucdutrukhoangsanChitietComponent', () => {
  let component: KhuvucdutrukhoangsanChitietComponent;
  let fixture: ComponentFixture<KhuvucdutrukhoangsanChitietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucdutrukhoangsanChitietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucdutrukhoangsanChitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
