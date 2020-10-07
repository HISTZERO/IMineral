import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TlgpTanthutralaiIoComponent } from './tlgp-tanthutralai-io.component';

describe('TlgpTanthutralaiIoComponent', () => {
  let component: TlgpTanthutralaiIoComponent;
  let fixture: ComponentFixture<TlgpTanthutralaiIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlgpTanthutralaiIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlgpTanthutralaiIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
