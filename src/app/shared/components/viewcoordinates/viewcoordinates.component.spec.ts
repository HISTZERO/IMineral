import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcoordinatesComponent } from './viewcoordinates.component';

describe('ViewcoordinatesComponent', () => {
  let component: ViewcoordinatesComponent;
  let fixture: ComponentFixture<ViewcoordinatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewcoordinatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcoordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
