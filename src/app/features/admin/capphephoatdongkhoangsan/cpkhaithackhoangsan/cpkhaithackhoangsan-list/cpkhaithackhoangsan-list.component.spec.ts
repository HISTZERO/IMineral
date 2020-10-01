import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CpkhaithackhoangsanListComponent} from './cpkhaithackhoangsan-list.component';

describe('CpkhaithackhoangsanListComponent', () => {
  let component: CpkhaithackhoangsanListComponent;
  let fixture: ComponentFixture<CpkhaithackhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpkhaithackhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpkhaithackhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
