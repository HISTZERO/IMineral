import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietlaptramListComponent } from './thietlaptram-list.component';

describe('ThietlaptramListComponent', () => {
  let component: ThietlaptramListComponent;
  let fixture: ComponentFixture<ThietlaptramListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThietlaptramListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietlaptramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
