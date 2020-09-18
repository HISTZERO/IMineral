import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaikhoangsanListComponent } from './loaikhoangsan-list.component';

describe('LoaikhoangsanListComponent', () => {
  let component: LoaikhoangsanListComponent;
  let fixture: ComponentFixture<LoaikhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaikhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaikhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
