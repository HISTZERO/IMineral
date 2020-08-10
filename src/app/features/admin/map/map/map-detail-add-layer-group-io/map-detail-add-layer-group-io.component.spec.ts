import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDetailAddLayerGroupIoComponent } from './map-detail-add-layer-group-io.component';

describe('MapDetailAddLayerGroupIoComponent', () => {
  let component: MapDetailAddLayerGroupIoComponent;
  let fixture: ComponentFixture<MapDetailAddLayerGroupIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDetailAddLayerGroupIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDetailAddLayerGroupIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
