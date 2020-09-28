import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpthamdokhoangsanIoComponent } from './cpthamdokhoangsan-io.component';

describe('ThamdokhoangsanIoComponent', () => {
  let component: CpthamdokhoangsanIoComponent;
  let fixture: ComponentFixture<CpthamdokhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpthamdokhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpthamdokhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
