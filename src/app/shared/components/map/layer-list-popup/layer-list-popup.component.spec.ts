import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerListPopupComponent } from './layer-list-popup.component';

describe('LayerListPopupComponent', () => {
  let component: LayerListPopupComponent;
  let fixture: ComponentFixture<LayerListPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerListPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});