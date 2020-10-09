import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmKhuvuckhaithacIoComponent } from './dcm-khuvuckhaithac-io.component';

describe('DcmKhuvuckhaithacIoComponent', () => {
  let component: DcmKhuvuckhaithacIoComponent;
  let fixture: ComponentFixture<DcmKhuvuckhaithacIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcmKhuvuckhaithacIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcmKhuvuckhaithacIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
