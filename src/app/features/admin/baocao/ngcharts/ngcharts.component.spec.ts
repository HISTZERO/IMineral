import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgchartsComponent } from './ngcharts.component';

describe('NgchartsComponent', () => {
  let component: NgchartsComponent;
  let fixture: ComponentFixture<NgchartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgchartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
