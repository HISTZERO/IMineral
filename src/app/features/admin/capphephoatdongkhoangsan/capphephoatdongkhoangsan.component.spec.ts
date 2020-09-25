import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapphephoatdongkhoangsanComponent } from './capphephoatdongkhoangsan.component';

describe('DiemquangMoquangComponent', () => {
  let component: CapphephoatdongkhoangsanComponent;
  let fixture: ComponentFixture<CapphephoatdongkhoangsanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapphephoatdongkhoangsanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapphephoatdongkhoangsanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
