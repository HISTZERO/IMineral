import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvuctoadoListComponent } from './khuvuctoado-list.component';

describe('KhuvuctoadoListComponent', () => {
  let component: KhuvuctoadoListComponent;
  let fixture: ComponentFixture<KhuvuctoadoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuctoadoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuctoadoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
