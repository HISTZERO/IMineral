import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinhtiencapquyenIoComponent } from './tinhtiencapquyen-io.component';

describe('TinhtiencapquyenIoComponent', () => {
  let component: TinhtiencapquyenIoComponent;
  let fixture: ComponentFixture<TinhtiencapquyenIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinhtiencapquyenIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinhtiencapquyenIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
