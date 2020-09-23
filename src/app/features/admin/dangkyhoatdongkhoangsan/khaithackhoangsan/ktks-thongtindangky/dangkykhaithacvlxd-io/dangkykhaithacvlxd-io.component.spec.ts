import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkykhaithacvlxdIoComponent } from './dangkykhaithacvlxd-io.component';

describe('DangkykhaithacvlxdIoComponent', () => {
  let component: DangkykhaithacvlxdIoComponent;
  let fixture: ComponentFixture<DangkykhaithacvlxdIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkykhaithacvlxdIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkykhaithacvlxdIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
