import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGroupIoComponent } from './map-group-io.component';

describe('MapGroupIoComponent', () => {
  let component: MapGroupIoComponent;
  let fixture: ComponentFixture<MapGroupIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapGroupIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGroupIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
