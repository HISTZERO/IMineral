import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChudeComponent } from './chude.component';

describe('ChudeComponent', () => {
  let component: ChudeComponent;
  let fixture: ComponentFixture<ChudeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChudeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
