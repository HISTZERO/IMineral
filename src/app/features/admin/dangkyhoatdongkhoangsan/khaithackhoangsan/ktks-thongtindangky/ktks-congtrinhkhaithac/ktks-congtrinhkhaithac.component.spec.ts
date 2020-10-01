import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtksCongtrinhkhaithacComponent } from './ktks-congtrinhkhaithac.component';

describe('KtksCongtrinhkhaithacComponent', () => {
  let component: KtksCongtrinhkhaithacComponent;
  let fixture: ComponentFixture<KtksCongtrinhkhaithacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtksCongtrinhkhaithacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtksCongtrinhkhaithacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
