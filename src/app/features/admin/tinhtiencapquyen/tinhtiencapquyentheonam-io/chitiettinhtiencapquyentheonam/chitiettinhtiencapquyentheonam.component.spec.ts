import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitiettinhtiencapquyentheonamComponent } from './chitiettinhtiencapquyentheonam.component';

describe('ChitiettinhtiencapquyentheonamComponent', () => {
  let component: ChitiettinhtiencapquyentheonamComponent;
  let fixture: ComponentFixture<ChitiettinhtiencapquyentheonamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChitiettinhtiencapquyentheonamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChitiettinhtiencapquyentheonamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
