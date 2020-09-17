import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhaithackhoangsanListComponent } from './khaithackhoangsan-list.component';

describe('KhaithackhoangsanListComponent', () => {
  let component: KhaithackhoangsanListComponent;
  let fixture: ComponentFixture<KhaithackhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhaithackhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhaithackhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
