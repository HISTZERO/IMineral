import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TlgpKhaithactralaiIoComponent } from './tlgp-khaithactralai-io.component';

describe('TlgpKhaithactralaiIoComponent', () => {
  let component: TlgpKhaithactralaiIoComponent;
  let fixture: ComponentFixture<TlgpKhaithactralaiIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlgpKhaithactralaiIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlgpKhaithactralaiIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
