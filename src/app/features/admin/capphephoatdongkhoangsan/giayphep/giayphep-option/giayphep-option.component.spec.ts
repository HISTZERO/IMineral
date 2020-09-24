import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiayphepOptionComponent } from './giayphep-option.component';

describe('GiayphepOptionComponent', () => {
  let component: GiayphepOptionComponent;
  let fixture: ComponentFixture<GiayphepOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiayphepOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiayphepOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
