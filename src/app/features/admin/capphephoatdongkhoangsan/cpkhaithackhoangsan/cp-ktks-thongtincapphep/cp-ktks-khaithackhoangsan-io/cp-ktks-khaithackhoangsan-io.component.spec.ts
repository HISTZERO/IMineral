import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksKhaithackhoangsanIoComponent } from './cp-ktks-khaithackhoangsan-io.component';

describe('CpKtksKhaithackhoangsanIoComponent', () => {
  let component: CpKtksKhaithackhoangsanIoComponent;
  let fixture: ComponentFixture<CpKtksKhaithackhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksKhaithackhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksKhaithackhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
