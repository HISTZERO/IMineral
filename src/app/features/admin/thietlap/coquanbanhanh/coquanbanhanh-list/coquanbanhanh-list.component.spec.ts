import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoquanbanhanhListComponent } from './coquanbanhanh-list.component';

describe('CoquanbanhanhListComponent', () => {
  let component: CoquanbanhanhListComponent;
  let fixture: ComponentFixture<CoquanbanhanhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoquanbanhanhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoquanbanhanhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
