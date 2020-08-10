import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDetailListComponent } from './map-detail-list.component';

describe('MapDetailListComponent', () => {
  let component: MapDetailListComponent;
  let fixture: ComponentFixture<MapDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
