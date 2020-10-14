import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkykhaithacchuyennhuongIoComponent } from './dangkykhaithacchuyennhuong-io.component';

describe('DangkykhaithacchuyennhuongIoComponent', () => {
  let component: DangkykhaithacchuyennhuongIoComponent;
  let fixture: ComponentFixture<DangkykhaithacchuyennhuongIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkykhaithacchuyennhuongIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkykhaithacchuyennhuongIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
