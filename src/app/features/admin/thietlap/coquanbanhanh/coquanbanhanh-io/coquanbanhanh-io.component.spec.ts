import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoquanbanhanhIoComponent } from './coquanbanhanh-io.component';

describe('CoquanbanhanhIoComponent', () => {
  let component: CoquanbanhanhIoComponent;
  let fixture: ComponentFixture<CoquanbanhanhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoquanbanhanhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoquanbanhanhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
