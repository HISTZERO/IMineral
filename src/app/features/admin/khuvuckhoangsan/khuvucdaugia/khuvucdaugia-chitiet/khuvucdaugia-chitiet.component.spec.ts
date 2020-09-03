/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KhuvucdaugiaChitietComponent } from './khuvucdaugia-chitiet.component';

describe('KhuvucdaugiaChitietComponent', () => {
  let component: KhuvucdaugiaChitietComponent;
  let fixture: ComponentFixture<KhuvucdaugiaChitietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucdaugiaChitietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucdaugiaChitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
