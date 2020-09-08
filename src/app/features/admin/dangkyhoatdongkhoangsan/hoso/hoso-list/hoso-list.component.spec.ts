import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosoListComponent } from './hoso-list.component';

describe('HosoListComponent', () => {
  let component: HosoListComponent;
  let fixture: ComponentFixture<HosoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
