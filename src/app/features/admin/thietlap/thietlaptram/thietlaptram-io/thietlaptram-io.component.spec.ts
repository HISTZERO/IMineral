import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietlaptramIoComponent } from './thietlaptram-io.component';

describe('ThietlaptramIoComponent', () => {
  let component: ThietlaptramIoComponent;
  let fixture: ComponentFixture<ThietlaptramIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThietlaptramIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietlaptramIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
