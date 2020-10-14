import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksKhuvuckhaithacListComponent } from './cp-ktks-khuvuckhaithac-list.component';

describe('CpKtksKhuvuckhaithacListComponent', () => {
  let component: CpKtksKhuvuckhaithacListComponent;
  let fixture: ComponentFixture<CpKtksKhuvuckhaithacListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksKhuvuckhaithacListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksKhuvuckhaithacListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
