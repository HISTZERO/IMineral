import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtksLoaikhoangsanListComponent } from './ktks-loaikhoangsan-list.component';

describe('KtksLoaikhoangsanListComponent', () => {
  let component: KtksLoaikhoangsanListComponent;
  let fixture: ComponentFixture<KtksLoaikhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtksLoaikhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtksLoaikhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
