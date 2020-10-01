import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosotailieuIoComponent } from './hosotailieu-io.component';

describe('HosotailieuIoComponent', () => {
  let component: HosotailieuIoComponent;
  let fixture: ComponentFixture<HosotailieuIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosotailieuIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosotailieuIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
