import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CppheduyettruluongkhoangsanIoComponent } from './cppheduyettruluongkhoangsan-io.component';

describe('CppheduyettruluongkhoangsanIoComponent', () => {
  let component: CppheduyettruluongkhoangsanIoComponent;
  let fixture: ComponentFixture<CppheduyettruluongkhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CppheduyettruluongkhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CppheduyettruluongkhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
