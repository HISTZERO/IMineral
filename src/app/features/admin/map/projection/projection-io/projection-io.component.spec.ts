import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionIoComponent } from './projection-io.component';

describe('ProjectionIoComponent', () => {
  let component: ProjectionIoComponent;
  let fixture: ComponentFixture<ProjectionIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectionIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectionIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
