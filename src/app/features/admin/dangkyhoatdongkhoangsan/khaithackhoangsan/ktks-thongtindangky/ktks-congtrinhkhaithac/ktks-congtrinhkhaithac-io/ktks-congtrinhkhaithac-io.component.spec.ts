import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtksCongtrinhkhaithacIoComponent } from './ktks-congtrinhkhaithac-io.component';

describe('KtksCongtrinhkhaithacIoComponent', () => {
  let component: KtksCongtrinhkhaithacIoComponent;
  let fixture: ComponentFixture<KtksCongtrinhkhaithacIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtksCongtrinhkhaithacIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtksCongtrinhkhaithacIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
