import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtksLoaikhoangsanComponent } from './ttks-loaikhoangsan.component';

describe('TtksLoaikhoangsanComponent', () => {
  let component: TtksLoaikhoangsanComponent;
  let fixture: ComponentFixture<TtksLoaikhoangsanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtksLoaikhoangsanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtksLoaikhoangsanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
