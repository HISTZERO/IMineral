import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmKhuvuckhaithacListComponent } from './dcm-khuvuckhaithac-list.component';

describe('DcmKhuvuckhaithacListComponent', () => {
  let component: DcmKhuvuckhaithacListComponent;
  let fixture: ComponentFixture<DcmKhuvuckhaithacListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcmKhuvuckhaithacListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcmKhuvuckhaithacListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
