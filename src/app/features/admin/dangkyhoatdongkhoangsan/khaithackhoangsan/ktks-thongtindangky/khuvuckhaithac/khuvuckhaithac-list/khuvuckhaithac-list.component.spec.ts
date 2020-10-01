import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvuckhaithacListComponent } from './khuvuckhaithac-list.component';

describe('KhuvuckhaithacListComponent', () => {
  let component: KhuvuckhaithacListComponent;
  let fixture: ComponentFixture<KhuvuckhaithacListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuckhaithacListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuckhaithacListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
