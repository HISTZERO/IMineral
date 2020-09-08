import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkyhoatdongkhoangsanComponent } from './dangkyhoatdongkhoangsan.component';

describe('DiemquangMoquangComponent', () => {
  let component: DangkyhoatdongkhoangsanComponent;
  let fixture: ComponentFixture<DangkyhoatdongkhoangsanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkyhoatdongkhoangsanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkyhoatdongkhoangsanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
