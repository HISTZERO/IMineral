import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtksCongtrinhkhaithacListComponent } from './ktks-congtrinhkhaithac-list.component';

describe('KtksCongtrinhkhaithacListComponent', () => {
  let component: KtksCongtrinhkhaithacListComponent;
  let fixture: ComponentFixture<KtksCongtrinhkhaithacListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtksCongtrinhkhaithacListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtksCongtrinhkhaithacListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
