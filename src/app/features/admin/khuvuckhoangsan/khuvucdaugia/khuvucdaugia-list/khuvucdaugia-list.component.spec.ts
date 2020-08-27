import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvucdaugiaListComponent } from './khuvucdaugia-list.component';

describe('KhuvucdaugiaListComponent', () => {
  let component: KhuvucdaugiaListComponent;
  let fixture: ComponentFixture<KhuvucdaugiaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucdaugiaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucdaugiaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
