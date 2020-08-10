import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDetailAddLayerIoComponent } from './map-detail-add-layer-io.component';

describe('MapDetailAddLayerIoComponent', () => {
  let component: MapDetailAddLayerIoComponent;
  let fixture: ComponentFixture<MapDetailAddLayerIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDetailAddLayerIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDetailAddLayerIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
