import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerGroupDetailListComponent } from './layer-group-detail-list.component';

describe('LayerGroupDetailListComponent', () => {
  let component: LayerGroupDetailListComponent;
  let fixture: ComponentFixture<LayerGroupDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerGroupDetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerGroupDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
