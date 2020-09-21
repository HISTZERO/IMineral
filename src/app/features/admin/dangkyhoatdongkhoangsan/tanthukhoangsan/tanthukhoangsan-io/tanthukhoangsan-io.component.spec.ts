import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TanthukhoangsanIoComponent } from './tanthukhoangsan-io.component';

describe('TanthukhoangsanIoComponent', () => {
  let component: TanthukhoangsanIoComponent;
  let fixture: ComponentFixture<TanthukhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TanthukhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TanthukhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
