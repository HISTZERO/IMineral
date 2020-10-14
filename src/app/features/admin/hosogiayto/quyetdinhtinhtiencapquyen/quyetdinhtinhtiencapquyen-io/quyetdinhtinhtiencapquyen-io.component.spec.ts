import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetdinhtinhtiencapquyenIoComponent } from './quyetdinhtinhtiencapquyen-io.component';

describe('QuyetdinhtinhtiencapquyenIoComponent', () => {
  let component: QuyetdinhtinhtiencapquyenIoComponent;
  let fixture: ComponentFixture<QuyetdinhtinhtiencapquyenIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuyetdinhtinhtiencapquyenIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetdinhtinhtiencapquyenIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
