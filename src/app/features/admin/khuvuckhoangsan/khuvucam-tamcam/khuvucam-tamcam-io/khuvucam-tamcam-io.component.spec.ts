import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvucamTamcamIoComponent } from './khuvucam-tamcam-io.component';

describe('KhuvucamTamcamIoComponent', () => {
  let component: KhuvucamTamcamIoComponent;
  let fixture: ComponentFixture<KhuvucamTamcamIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucamTamcamIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucamTamcamIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
