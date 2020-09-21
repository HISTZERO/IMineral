import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaugiaquyenIoComponent } from './daugiaquyen-io.component';

describe('DaugiaquyenIoComponent', () => {
  let component: DaugiaquyenIoComponent;
  let fixture: ComponentFixture<DaugiaquyenIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaugiaquyenIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaugiaquyenIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
