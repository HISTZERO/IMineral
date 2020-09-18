import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkythamdokhoangsanIoComponent } from './dangkythamdokhoangsan-io.component';

describe('DangkythamdokhoangsanIoComponent', () => {
  let component: DangkythamdokhoangsanIoComponent;
  let fixture: ComponentFixture<DangkythamdokhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkythamdokhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkythamdokhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
