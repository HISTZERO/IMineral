import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvuckhaithacIoComponent } from './khuvuckhaithac-io.component';

describe('KhuvuckhaithacIoComponent', () => {
  let component: KhuvuckhaithacIoComponent;
  let fixture: ComponentFixture<KhuvuckhaithacIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuckhaithacIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuckhaithacIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
