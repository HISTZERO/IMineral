import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaikhoangsanIoComponent } from './loaikhoangsan-io.component';

describe('LoaikhoangsanIoComponent', () => {
  let component: LoaikhoangsanIoComponent;
  let fixture: ComponentFixture<LoaikhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaikhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaikhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
