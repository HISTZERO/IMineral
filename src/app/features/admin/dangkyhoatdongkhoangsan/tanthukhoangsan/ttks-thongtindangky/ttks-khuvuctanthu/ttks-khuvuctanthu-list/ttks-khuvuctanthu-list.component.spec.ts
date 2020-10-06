import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtksKhuvuctanthuListComponent } from './ttks-khuvuctanthu-list.component';

describe('TtksKhuvuctanthuListComponent', () => {
  let component: TtksKhuvuctanthuListComponent;
  let fixture: ComponentFixture<TtksKhuvuctanthuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtksKhuvuctanthuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtksKhuvuctanthuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
