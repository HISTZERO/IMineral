import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThamdokhoangsanIoComponent } from './thamdokhoangsan-io.component';

describe('ThamdokhoangsanIoComponent', () => {
  let component: ThamdokhoangsanIoComponent;
  let fixture: ComponentFixture<ThamdokhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThamdokhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThamdokhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
