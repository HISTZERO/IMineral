import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvucamTamcamListComponent } from './khuvucam-tamcam-list.component';

describe('KhuvucamTamcamListComponent', () => {
  let component: KhuvucamTamcamListComponent;
  let fixture: ComponentFixture<KhuvucamTamcamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucamTamcamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucamTamcamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
