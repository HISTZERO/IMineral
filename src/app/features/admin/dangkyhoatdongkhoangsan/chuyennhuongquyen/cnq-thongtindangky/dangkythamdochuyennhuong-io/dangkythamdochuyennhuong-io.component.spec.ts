import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkythamdochuyennhuongIoComponent } from './dangkythamdochuyennhuong-io.component';

describe('DangkythamdochuyennhuongIoComponent', () => {
  let component: DangkythamdochuyennhuongIoComponent;
  let fixture: ComponentFixture<DangkythamdochuyennhuongIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkythamdochuyennhuongIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkythamdochuyennhuongIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
