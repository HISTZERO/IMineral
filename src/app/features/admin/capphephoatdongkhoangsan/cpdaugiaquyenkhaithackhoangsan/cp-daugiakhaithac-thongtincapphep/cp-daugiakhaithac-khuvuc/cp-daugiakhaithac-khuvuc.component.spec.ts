import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDaugiakhaithacKhuvucComponent } from './cp-daugiakhaithac-khuvuc.component';

describe('CpDaugiakhaithacKhuvucComponent', () => {
  let component: CpDaugiakhaithacKhuvucComponent;
  let fixture: ComponentFixture<CpDaugiakhaithacKhuvucComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpDaugiakhaithacKhuvucComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpDaugiakhaithacKhuvucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
