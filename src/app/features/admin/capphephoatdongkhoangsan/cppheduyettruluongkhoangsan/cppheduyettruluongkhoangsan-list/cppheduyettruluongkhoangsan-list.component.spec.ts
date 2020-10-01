import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CppheduyettruluongkhoangsanListComponent } from './cppheduyettruluongkhoangsan-list.component';

describe('CppheduyettruluongkhoangsanListComponent', () => {
  let component: CppheduyettruluongkhoangsanListComponent;
  let fixture: ComponentFixture<CppheduyettruluongkhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CppheduyettruluongkhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CppheduyettruluongkhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
