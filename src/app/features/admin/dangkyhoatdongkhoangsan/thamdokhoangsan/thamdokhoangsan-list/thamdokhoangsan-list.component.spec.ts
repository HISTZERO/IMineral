import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThamdokhoangsanListComponent } from './thamdokhoangsan-list.component';

describe('ThamdokhoangsanListComponent', () => {
  let component: ThamdokhoangsanListComponent;
  let fixture: ComponentFixture<ThamdokhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThamdokhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThamdokhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
