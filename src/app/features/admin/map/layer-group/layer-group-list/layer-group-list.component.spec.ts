import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerGroupListComponent } from './layer-group-list.component';

describe('LayerGroupListComponent', () => {
  let component: LayerGroupListComponent;
  let fixture: ComponentFixture<LayerGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
