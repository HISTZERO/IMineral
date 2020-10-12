import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksKhuvuckhaithacIoComponent } from './cp-ktks-khuvuckhaithac-io.component';

describe('CpKtksKhuvuckhaithacIoComponent', () => {
  let component: CpKtksKhuvuckhaithacIoComponent;
  let fixture: ComponentFixture<CpKtksKhuvuckhaithacIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksKhuvuckhaithacIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksKhuvuckhaithacIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
