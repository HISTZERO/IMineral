import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinhvucIoComponent } from './linhvuc-io.component';

describe('LinhvucIoComponent', () => {
  let component: LinhvucIoComponent;
  let fixture: ComponentFixture<LinhvucIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinhvucIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinhvucIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
