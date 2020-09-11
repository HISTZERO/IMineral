import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmTochucOptionComponent } from './tochuc-option.component';

describe('TochucOptionComponent', () => {
  let component: DmTochucOptionComponent;
  let fixture: ComponentFixture<DmTochucOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmTochucOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmTochucOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
