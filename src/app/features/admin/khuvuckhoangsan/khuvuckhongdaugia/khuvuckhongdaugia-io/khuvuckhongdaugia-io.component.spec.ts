import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvuckhongdaugiaIoComponent } from './khuvuckhongdaugia-io.component';

describe('KhuvuckhongdaugiaIoComponent', () => {
  let component: KhuvuckhongdaugiaIoComponent;
  let fixture: ComponentFixture<KhuvuckhongdaugiaIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuckhongdaugiaIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuckhongdaugiaIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
