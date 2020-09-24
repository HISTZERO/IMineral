import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkykhaithaccaisoiIoComponent } from './dangkykhaithaccaisoi-io.component';

describe('DangkykhaithaccaisoiIoComponent', () => {
  let component: DangkykhaithaccaisoiIoComponent;
  let fixture: ComponentFixture<DangkykhaithaccaisoiIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkykhaithaccaisoiIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkykhaithaccaisoiIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
