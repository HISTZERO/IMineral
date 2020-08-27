import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvucdaugiaIoComponent } from './khuvucdaugia-io.component';

describe('KhuvucdaugiaIoComponent', () => {
  let component: KhuvucdaugiaIoComponent;
  let fixture: ComponentFixture<KhuvucdaugiaIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucdaugiaIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucdaugiaIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
