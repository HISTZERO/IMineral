import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksThietbikhaithacListComponent } from './cp-ktks-thietbikhaithac-list.component';

describe('CpKtksThietbikhaithacListComponent', () => {
  let component: CpKtksThietbikhaithacListComponent;
  let fixture: ComponentFixture<CpKtksThietbikhaithacListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksThietbikhaithacListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksThietbikhaithacListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
