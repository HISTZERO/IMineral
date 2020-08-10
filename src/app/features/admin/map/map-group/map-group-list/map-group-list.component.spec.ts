import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGroupListComponent } from './map-group-list.component';

describe('MapGroupListComponent', () => {
  let component: MapGroupListComponent;
  let fixture: ComponentFixture<MapGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
