import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDetailEditLayerPropertiesComponent } from './map-detail-edit-layer-properties.component';

describe('MapDetailEditLayerPropertiesComponent', () => {
  let component: MapDetailEditLayerPropertiesComponent;
  let fixture: ComponentFixture<MapDetailEditLayerPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDetailEditLayerPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDetailEditLayerPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
