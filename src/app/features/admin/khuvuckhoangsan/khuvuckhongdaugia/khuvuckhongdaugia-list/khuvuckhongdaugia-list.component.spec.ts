import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvuckhongdaugiaListComponent } from './khuvuckhongdaugia-list.component';

describe('KhuvuckhongdaugiaListComponent', () => {
  let component: KhuvuckhongdaugiaListComponent;
  let fixture: ComponentFixture<KhuvuckhongdaugiaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuckhongdaugiaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuckhongdaugiaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
