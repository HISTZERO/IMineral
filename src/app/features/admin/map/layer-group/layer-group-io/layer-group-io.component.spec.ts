import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerGroupIoComponent } from './layer-group-io.component';

describe('LayerGroupIoComponent', () => {
  let component: LayerGroupIoComponent;
  let fixture: ComponentFixture<LayerGroupIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerGroupIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerGroupIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
