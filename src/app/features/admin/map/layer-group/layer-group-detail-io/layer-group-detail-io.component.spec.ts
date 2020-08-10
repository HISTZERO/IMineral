import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerGroupDetailIoComponent } from './layer-group-detail-io.component';

describe('LayerGroupDetailIoComponent', () => {
  let component: LayerGroupDetailIoComponent;
  let fixture: ComponentFixture<LayerGroupDetailIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerGroupDetailIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerGroupDetailIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
