import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmCanhanOptionComponent } from './canhan-option.component';

describe('CanhanOptionComponent', () => {
  let component: DmCanhanOptionComponent;
  let fixture: ComponentFixture<DmCanhanOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmCanhanOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmCanhanOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
