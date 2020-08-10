import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDetailEditLayergroupPropertiesComponent } from './map-detail-edit-layergroup-properties.component';

describe('MapDetailEditLayergroupPropertiesComponent', () => {
  let component: MapDetailEditLayergroupPropertiesComponent;
  let fixture: ComponentFixture<MapDetailEditLayergroupPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDetailEditLayergroupPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDetailEditLayergroupPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
