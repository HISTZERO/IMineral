import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkythamdogiahanIoComponent } from './dangkythamdogiahan-io.component';

describe('DangkythamdogiahanIoComponent', () => {
  let component: DangkythamdogiahanIoComponent;
  let fixture: ComponentFixture<DangkythamdogiahanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkythamdogiahanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkythamdogiahanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
