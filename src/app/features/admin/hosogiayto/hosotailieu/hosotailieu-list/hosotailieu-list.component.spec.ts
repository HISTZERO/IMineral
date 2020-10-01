import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosotailieuListComponent } from './hosotailieu-list.component';

describe('HosotailieuListComponent', () => {
  let component: HosotailieuListComponent;
  let fixture: ComponentFixture<HosotailieuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosotailieuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosotailieuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
