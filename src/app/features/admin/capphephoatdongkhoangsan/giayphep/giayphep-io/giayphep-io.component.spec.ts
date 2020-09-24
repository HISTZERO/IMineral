import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiayphepIoComponent } from './giayphep-io.component';

describe('GiayphepIoComponent', () => {
  let component: GiayphepIoComponent;
  let fixture: ComponentFixture<GiayphepIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiayphepIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiayphepIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
