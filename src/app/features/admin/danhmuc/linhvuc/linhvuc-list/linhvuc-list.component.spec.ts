import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmLinhvucListComponent } from './linhvuc-list.component';

describe('DmLinhvucListComponent', () => {
  let component: DmLinhvucListComponent;
  let fixture: ComponentFixture<DmLinhvucListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmLinhvucListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmLinhvucListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
