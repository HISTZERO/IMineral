import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TanthukhoangsanListComponent } from './tanthukhoangsan-list.component';

describe('TanthukhoangsanListComponent', () => {
  let component: TanthukhoangsanListComponent;
  let fixture: ComponentFixture<TanthukhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TanthukhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TanthukhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
