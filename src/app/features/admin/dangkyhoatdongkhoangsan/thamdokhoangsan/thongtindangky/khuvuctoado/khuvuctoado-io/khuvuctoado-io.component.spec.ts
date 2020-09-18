import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvuctoadoIoComponent } from './khuvuctoado-io.component';

describe('KhuvuctoadoIoComponent', () => {
  let component: KhuvuctoadoIoComponent;
  let fixture: ComponentFixture<KhuvuctoadoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuctoadoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuctoadoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
