import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaikhoangsanComponent } from './loaikhoangsan.component';

describe('LoaikhoangsanComponent', () => {
  let component: LoaikhoangsanComponent;
  let fixture: ComponentFixture<LoaikhoangsanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaikhoangsanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaikhoangsanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
