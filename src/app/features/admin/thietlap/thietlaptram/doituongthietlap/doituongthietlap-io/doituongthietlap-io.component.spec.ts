import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoituongthietlapIoComponent } from './doituongthietlap-io.component';

describe('DoituongthietlapIoComponent', () => {
  let component: DoituongthietlapIoComponent;
  let fixture: ComponentFixture<DoituongthietlapIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoituongthietlapIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoituongthietlapIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
