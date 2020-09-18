import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvuctoadoComponent } from './khuvuctoado.component';

describe('KhuvuctoadoComponent', () => {
  let component: KhuvuctoadoComponent;
  let fixture: ComponentFixture<KhuvuctoadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuctoadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuctoadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
