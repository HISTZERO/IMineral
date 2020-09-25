import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpthamdokhoangsanListComponent } from './cpthamdokhoangsan-list.component';

describe('CpthamdokhoangsanListComponent', () => {
  let component: CpthamdokhoangsanListComponent;
  let fixture: ComponentFixture<CpthamdokhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpthamdokhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpthamdokhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
