import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapIoComponent } from './map-io.component';

describe('MapIoComponent', () => {
  let component: MapIoComponent;
  let fixture: ComponentFixture<MapIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
