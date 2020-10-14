import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpKtksCongtrinhkhaithacIoComponent } from './cp-ktks-congtrinhkhaithac-io.component';

describe('CpKtksCongtrinhkhaithacIoComponent', () => {
  let component: CpKtksCongtrinhkhaithacIoComponent;
  let fixture: ComponentFixture<CpKtksCongtrinhkhaithacIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpKtksCongtrinhkhaithacIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpKtksCongtrinhkhaithacIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
