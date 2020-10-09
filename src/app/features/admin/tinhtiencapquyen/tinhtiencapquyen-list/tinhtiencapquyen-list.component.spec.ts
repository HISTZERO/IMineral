import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinhtiencapquyenListComponent } from './tinhtiencapquyen-list.component';

describe('TinhtiencapquyenListComponent', () => {
  let component: TinhtiencapquyenListComponent;
  let fixture: ComponentFixture<TinhtiencapquyenListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinhtiencapquyenListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinhtiencapquyenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
