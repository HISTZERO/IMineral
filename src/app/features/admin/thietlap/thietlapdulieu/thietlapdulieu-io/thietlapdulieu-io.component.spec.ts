import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietlapdulieuIoComponent } from './thietlapdulieu-io.component';

describe('ThietlapdulieuIoComponent', () => {
  let component: ThietlapdulieuIoComponent;
  let fixture: ComponentFixture<ThietlapdulieuIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThietlapdulieuIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietlapdulieuIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
