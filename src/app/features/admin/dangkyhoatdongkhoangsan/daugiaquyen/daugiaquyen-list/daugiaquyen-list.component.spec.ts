import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaugiaquyenListComponent } from './daugiaquyen-list.component';

describe('DaugiaquyenListComponent', () => {
  let component: DaugiaquyenListComponent;
  let fixture: ComponentFixture<DaugiaquyenListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaugiaquyenListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaugiaquyenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
