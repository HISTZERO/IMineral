import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmLinhvucIoComponent } from './linhvuc-io.component';

describe('DmLinhvucIoComponent', () => {
  let component: DmLinhvucIoComponent;
  let fixture: ComponentFixture<DmLinhvucIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmLinhvucIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmLinhvucIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
