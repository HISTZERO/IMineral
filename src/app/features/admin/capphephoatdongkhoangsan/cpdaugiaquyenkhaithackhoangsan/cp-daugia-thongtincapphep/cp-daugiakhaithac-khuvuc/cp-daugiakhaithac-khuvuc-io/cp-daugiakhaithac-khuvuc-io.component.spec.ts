import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDaugiakhaithacKhuvucIoComponent } from './cp-daugiakhaithac-khuvuc-io.component';

describe('CpDaugiakhaithacKhuvucIoComponent', () => {
  let component: CpDaugiakhaithacKhuvucIoComponent;
  let fixture: ComponentFixture<CpDaugiakhaithacKhuvucIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpDaugiakhaithacKhuvucIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpDaugiakhaithacKhuvucIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
