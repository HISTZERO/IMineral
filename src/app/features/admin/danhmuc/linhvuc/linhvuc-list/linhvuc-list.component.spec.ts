import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinhvucListComponent } from './linhvuc-list.component';

describe('LinhvucListComponent', () => {
  let component: LinhvucListComponent;
  let fixture: ComponentFixture<LinhvucListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinhvucListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinhvucListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
