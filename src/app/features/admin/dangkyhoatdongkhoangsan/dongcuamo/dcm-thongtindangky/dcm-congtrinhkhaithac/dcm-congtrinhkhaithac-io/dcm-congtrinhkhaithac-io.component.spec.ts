import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmCongtrinhkhaithacIoComponent } from './dcm-congtrinhkhaithac-io.component';

describe('DcmCongtrinhkhaithacIoComponent', () => {
  let component: DcmCongtrinhkhaithacIoComponent;
  let fixture: ComponentFixture<DcmCongtrinhkhaithacIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcmCongtrinhkhaithacIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcmCongtrinhkhaithacIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
