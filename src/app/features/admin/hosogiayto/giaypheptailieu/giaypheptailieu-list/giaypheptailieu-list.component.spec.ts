import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiaypheptailieuListComponent } from './giaypheptailieu-list.component';

describe('GiaypheptailieuListComponent', () => {
  let component: GiaypheptailieuListComponent;
  let fixture: ComponentFixture<GiaypheptailieuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiaypheptailieuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiaypheptailieuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
