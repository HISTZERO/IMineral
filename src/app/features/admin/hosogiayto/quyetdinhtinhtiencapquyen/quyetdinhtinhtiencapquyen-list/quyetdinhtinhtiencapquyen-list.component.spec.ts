import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetdinhtinhtiencapquyenListComponent } from './quyetdinhtinhtiencapquyen-list.component';

describe('QuyetdinhtinhtiencapquyenListComponent', () => {
  let component: QuyetdinhtinhtiencapquyenListComponent;
  let fixture: ComponentFixture<QuyetdinhtinhtiencapquyenListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuyetdinhtinhtiencapquyenListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetdinhtinhtiencapquyenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
