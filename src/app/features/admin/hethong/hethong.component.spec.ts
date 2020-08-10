import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HethongComponent } from './hethong.component';

describe('HethongComponent', () => {
  let component: HethongComponent;
  let fixture: ComponentFixture<HethongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HethongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HethongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
