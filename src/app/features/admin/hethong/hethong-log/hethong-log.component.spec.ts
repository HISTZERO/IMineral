import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HethongLogComponent } from './hethong-log.component';

describe('HethongLogComponent', () => {
  let component: HethongLogComponent;
  let fixture: ComponentFixture<HethongLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HethongLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HethongLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
