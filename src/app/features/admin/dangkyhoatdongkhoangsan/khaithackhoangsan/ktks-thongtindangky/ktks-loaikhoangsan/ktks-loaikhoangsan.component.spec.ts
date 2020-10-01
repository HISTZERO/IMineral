import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtksLoaikhoangsanComponent } from './ktks-loaikhoangsan.component';

describe('KtksLoaikhoangsanComponent', () => {
  let component: KtksLoaikhoangsanComponent;
  let fixture: ComponentFixture<KtksLoaikhoangsanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtksLoaikhoangsanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtksLoaikhoangsanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
