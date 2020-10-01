import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptanthukhoangsanListComponent } from './cptanthukhoangsan-list.component';

describe('CptanthukhoangsanListComponent', () => {
  let component: CptanthukhoangsanListComponent;
  let fixture: ComponentFixture<CptanthukhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptanthukhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptanthukhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
