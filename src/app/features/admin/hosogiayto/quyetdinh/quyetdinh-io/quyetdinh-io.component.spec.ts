import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetdinhIoComponent } from './quyetdinh-io.component';

describe('QuyetdinhIoComponent', () => {
  let component: QuyetdinhIoComponent;
  let fixture: ComponentFixture<QuyetdinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuyetdinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetdinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
