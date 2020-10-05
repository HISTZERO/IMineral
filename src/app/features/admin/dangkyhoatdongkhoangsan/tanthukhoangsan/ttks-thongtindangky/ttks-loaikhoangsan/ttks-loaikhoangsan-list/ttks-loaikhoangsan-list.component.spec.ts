import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtksLoaikhoangsanListComponent } from './ttks-loaikhoangsan-list.component';

describe('TtksLoaikhoangsanListComponent', () => {
  let component: TtksLoaikhoangsanListComponent;
  let fixture: ComponentFixture<TtksLoaikhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtksLoaikhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtksLoaikhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
