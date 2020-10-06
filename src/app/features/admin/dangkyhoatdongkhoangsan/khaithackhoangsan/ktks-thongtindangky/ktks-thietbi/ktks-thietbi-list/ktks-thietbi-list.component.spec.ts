import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtksThietbiListComponent } from './ktks-thietbi-list.component';

describe('KtksThietbiListComponent', () => {
  let component: KtksThietbiListComponent;
  let fixture: ComponentFixture<KtksThietbiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtksThietbiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtksThietbiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
