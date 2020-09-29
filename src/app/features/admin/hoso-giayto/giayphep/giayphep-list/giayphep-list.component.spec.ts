import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiayphepListComponent } from './giayphep-list.component';

describe('GiayphepListComponent', () => {
  let component: GiayphepListComponent;
  let fixture: ComponentFixture<GiayphepListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiayphepListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiayphepListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
