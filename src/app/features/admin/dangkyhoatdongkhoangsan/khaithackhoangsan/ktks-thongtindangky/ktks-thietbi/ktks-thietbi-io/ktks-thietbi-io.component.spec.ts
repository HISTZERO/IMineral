import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtksThietbiIoComponent } from './ktks-thietbi-io.component';

describe('KtksThietbiIoComponent', () => {
  let component: KtksThietbiIoComponent;
  let fixture: ComponentFixture<KtksThietbiIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtksThietbiIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtksThietbiIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
