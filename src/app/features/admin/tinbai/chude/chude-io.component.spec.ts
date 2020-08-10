import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChudeIoComponent } from './chude-io.component';

describe('ChudeIoComponent', () => {
  let component: ChudeIoComponent;
  let fixture: ComponentFixture<ChudeIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChudeIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChudeIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
