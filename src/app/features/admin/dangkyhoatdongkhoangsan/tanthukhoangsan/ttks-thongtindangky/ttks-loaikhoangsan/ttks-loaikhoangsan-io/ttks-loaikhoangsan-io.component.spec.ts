import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtksLoaikhoangsanIoComponent } from './ttks-loaikhoangsan-io.component';

describe('TtksLoaikhoangsanIoComponent', () => {
  let component: TtksLoaikhoangsanIoComponent;
  let fixture: ComponentFixture<TtksLoaikhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtksLoaikhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtksLoaikhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
