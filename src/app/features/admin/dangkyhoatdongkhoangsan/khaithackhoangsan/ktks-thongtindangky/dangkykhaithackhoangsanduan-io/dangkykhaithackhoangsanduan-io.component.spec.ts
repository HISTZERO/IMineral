import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkykhaithackhoangsanduanIoComponent } from './dangkykhaithackhoangsanduan-io.component';

describe('DangkykhaithackhoangsanduanIoComponent', () => {
  let component: DangkykhaithackhoangsanduanIoComponent;
  let fixture: ComponentFixture<DangkykhaithackhoangsanduanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkykhaithackhoangsanduanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkykhaithackhoangsanduanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
