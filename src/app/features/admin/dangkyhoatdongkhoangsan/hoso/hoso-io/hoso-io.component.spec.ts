import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosoIoComponent } from './hoso-io.component';

describe('HosoIoComponent', () => {
  let component: HosoIoComponent;
  let fixture: ComponentFixture<HosoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
