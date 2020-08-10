import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapListPopupComponent } from './map-list-popup.component';

describe('MapListPopupComponent', () => {
  let component: MapListPopupComponent;
  let fixture: ComponentFixture<MapListPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapListPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});