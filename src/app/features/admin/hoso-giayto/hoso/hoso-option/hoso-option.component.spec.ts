import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosoOptionComponent } from './hoso-option.component';

describe('HosoListComponent', () => {
  let component: HosoOptionComponent;
  let fixture: ComponentFixture<HosoOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosoOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosoOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
