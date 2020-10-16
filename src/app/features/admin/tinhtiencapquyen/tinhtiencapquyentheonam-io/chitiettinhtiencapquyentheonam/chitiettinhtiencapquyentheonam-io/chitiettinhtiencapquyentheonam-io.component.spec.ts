import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitiettinhtiencapquyentheonamIoComponent } from './chitiettinhtiencapquyentheonam-io.component';

describe('ChitiettinhtiencapquyentheonamIoComponent', () => {
  let component: ChitiettinhtiencapquyentheonamIoComponent;
  let fixture: ComponentFixture<ChitiettinhtiencapquyentheonamIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChitiettinhtiencapquyentheonamIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChitiettinhtiencapquyentheonamIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
