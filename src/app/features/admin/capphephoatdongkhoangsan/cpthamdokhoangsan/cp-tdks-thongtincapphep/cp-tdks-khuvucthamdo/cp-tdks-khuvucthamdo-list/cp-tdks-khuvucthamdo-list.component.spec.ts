import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTdksKhuvucthamdoListComponent } from './cp-tdks-khuvucthamdo-list.component';

describe('CpTdksKhuvucthamdoListComponent', () => {
  let component: CpTdksKhuvucthamdoListComponent;
  let fixture: ComponentFixture<CpTdksKhuvucthamdoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTdksKhuvucthamdoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTdksKhuvucthamdoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
