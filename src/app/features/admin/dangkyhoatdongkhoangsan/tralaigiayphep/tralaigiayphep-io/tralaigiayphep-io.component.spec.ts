import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TralaigiayphepIoComponent } from './tralaigiayphep-io.component';

describe('TralaigiayphepIoComponent', () => {
  let component: TralaigiayphepIoComponent;
  let fixture: ComponentFixture<TralaigiayphepIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TralaigiayphepIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TralaigiayphepIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
