import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChuyennhuongquyenListComponent } from './chuyennhuongquyen-list.component';

describe('ChuyennhuongquyenListComponent', () => {
  let component: ChuyennhuongquyenListComponent;
  let fixture: ComponentFixture<ChuyennhuongquyenListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChuyennhuongquyenListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChuyennhuongquyenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
