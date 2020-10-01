import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpkhaithackhoangsanIoComponent } from './cpkhaithackhoangsan-io.component';

describe('CpkhaithackhoangsanIoComponent', () => {
  let component: CpkhaithackhoangsanIoComponent;
  let fixture: ComponentFixture<CpkhaithackhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpkhaithackhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpkhaithackhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
