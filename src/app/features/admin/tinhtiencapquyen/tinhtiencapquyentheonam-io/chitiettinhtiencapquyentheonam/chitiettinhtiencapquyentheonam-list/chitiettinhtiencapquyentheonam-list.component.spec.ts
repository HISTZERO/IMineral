import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitiettinhtiencapquyentheonamListComponent } from './chitiettinhtiencapquyentheonam-list.component';

describe('ChitiettinhtiencapquyentheonamListComponent', () => {
  let component: ChitiettinhtiencapquyentheonamListComponent;
  let fixture: ComponentFixture<ChitiettinhtiencapquyentheonamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChitiettinhtiencapquyentheonamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChitiettinhtiencapquyentheonamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
