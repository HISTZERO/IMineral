import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksThietbikhaithacIoComponent } from './cp-ktks-thietbikhaithac-io.component';

describe('CpKtksThietbikhaithacIoComponent', () => {
  let component: CpKtksThietbikhaithacIoComponent;
  let fixture: ComponentFixture<CpKtksThietbikhaithacIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksThietbikhaithacIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksThietbikhaithacIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
