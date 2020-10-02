import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptralaigiayphepthamdokhaithackhoangsanListComponent } from './cptralaigiayphepthamdokhaithackhoangsan-list.component';

describe('CptralaigiayphepthamdokhaithackhoangsanListComponent', () => {
  let component: CptralaigiayphepthamdokhaithackhoangsanListComponent;
  let fixture: ComponentFixture<CptralaigiayphepthamdokhaithackhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptralaigiayphepthamdokhaithackhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptralaigiayphepthamdokhaithackhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
