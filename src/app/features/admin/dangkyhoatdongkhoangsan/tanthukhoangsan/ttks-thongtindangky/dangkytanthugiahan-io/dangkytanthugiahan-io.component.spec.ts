import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkytanthugiahanIoComponent } from './dangkytanthugiahan-io.component';

describe('DangkytanthugiahanIoComponent', () => {
  let component: DangkytanthugiahanIoComponent;
  let fixture: ComponentFixture<DangkytanthugiahanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkytanthugiahanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkytanthugiahanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
