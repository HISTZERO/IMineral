import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TralaigiayphepListComponent } from './tralaigiayphep-list.component';

describe('TralaigiayphepListComponent', () => {
  let component: TralaigiayphepListComponent;
  let fixture: ComponentFixture<TralaigiayphepListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TralaigiayphepListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TralaigiayphepListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
