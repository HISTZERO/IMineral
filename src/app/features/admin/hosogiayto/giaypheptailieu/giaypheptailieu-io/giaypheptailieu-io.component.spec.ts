import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiaypheptailieuIoComponent } from './giaypheptailieu-io.component';

describe('GiaypheptailieuIoComponent', () => {
  let component: GiaypheptailieuIoComponent;
  let fixture: ComponentFixture<GiaypheptailieuIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiaypheptailieuIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiaypheptailieuIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
