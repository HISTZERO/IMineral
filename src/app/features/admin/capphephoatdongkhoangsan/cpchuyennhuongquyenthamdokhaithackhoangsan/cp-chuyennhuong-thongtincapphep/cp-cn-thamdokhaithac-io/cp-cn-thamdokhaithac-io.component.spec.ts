import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpCnThamdokhaithacIoComponent } from './cp-cn-thamdokhaithac-io.component';

describe('CpCnThamdokhaithacIoComponent', () => {
  let component: CpCnThamdokhaithacIoComponent;
  let fixture: ComponentFixture<CpCnThamdokhaithacIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpCnThamdokhaithacIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpCnThamdokhaithacIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
