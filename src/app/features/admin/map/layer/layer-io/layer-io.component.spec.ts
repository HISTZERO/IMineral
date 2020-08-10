import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerIoComponent } from './layer-io.component';

describe('LayerIoComponent', () => {
  let component: LayerIoComponent;
  let fixture: ComponentFixture<LayerIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
