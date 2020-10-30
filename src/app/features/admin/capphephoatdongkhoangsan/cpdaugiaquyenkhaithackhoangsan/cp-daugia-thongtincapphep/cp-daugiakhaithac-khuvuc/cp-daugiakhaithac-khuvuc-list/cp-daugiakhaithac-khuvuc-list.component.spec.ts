import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDaugiakhaithacKhuvucListComponent } from './cp-daugiakhaithac-khuvuc-list.component';

describe('CpDaugiakhaithacKhuvucListComponent', () => {
  let component: CpDaugiakhaithacKhuvucListComponent;
  let fixture: ComponentFixture<CpDaugiakhaithacKhuvucListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpDaugiakhaithacKhuvucListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpDaugiakhaithacKhuvucListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
