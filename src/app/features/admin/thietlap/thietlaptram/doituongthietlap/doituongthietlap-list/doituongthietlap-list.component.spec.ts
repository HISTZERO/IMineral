import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoituongthietlapListComponent } from './doituongthietlap-list.component';

describe('DoituongthietlapListComponent', () => {
  let component: DoituongthietlapListComponent;
  let fixture: ComponentFixture<DoituongthietlapListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoituongthietlapListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoituongthietlapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
