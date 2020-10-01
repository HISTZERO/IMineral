import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtksLoaikhoangsanIoComponent } from './ktks-loaikhoangsan-io.component';

describe('KtksLoaikhoangsanIoComponent', () => {
  let component: KtksLoaikhoangsanIoComponent;
  let fixture: ComponentFixture<KtksLoaikhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtksLoaikhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtksLoaikhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
