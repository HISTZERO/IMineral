import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerGroupAddLayerIoComponent } from './layer-group-add-layer-io.component';

describe('LayerGroupAddLayerIoComponent', () => {
  let component: LayerGroupAddLayerIoComponent;
  let fixture: ComponentFixture<LayerGroupAddLayerIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerGroupAddLayerIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerGroupAddLayerIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
