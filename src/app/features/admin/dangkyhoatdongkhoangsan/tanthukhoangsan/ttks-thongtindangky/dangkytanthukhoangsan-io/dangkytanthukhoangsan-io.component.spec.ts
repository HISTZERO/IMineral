import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkytanthukhoangsanIoComponent } from './dangkytanthukhoangsan-io.component';

describe('DangkytanthukhoangsanIoComponent', () => {
  let component: DangkytanthukhoangsanIoComponent;
  let fixture: ComponentFixture<DangkytanthukhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkytanthukhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkytanthukhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
