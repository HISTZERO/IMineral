import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDetailAddNewGroupIoComponent } from './map-detail-add-new-group-io.component';

describe('MapDetailAddNewGroupIoComponent', () => {
  let component: MapDetailAddNewGroupIoComponent;
  let fixture: ComponentFixture<MapDetailAddNewGroupIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDetailAddNewGroupIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDetailAddNewGroupIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
