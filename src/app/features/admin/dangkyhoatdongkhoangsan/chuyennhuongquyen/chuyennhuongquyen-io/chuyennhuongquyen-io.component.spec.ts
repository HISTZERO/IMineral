import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChuyennhuongquyenIoComponent } from './chuyennhuongquyen-io.component';

describe('ChuyennhuongquyenIoComponent', () => {
  let component: ChuyennhuongquyenIoComponent;
  let fixture: ComponentFixture<ChuyennhuongquyenIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChuyennhuongquyenIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChuyennhuongquyenIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
