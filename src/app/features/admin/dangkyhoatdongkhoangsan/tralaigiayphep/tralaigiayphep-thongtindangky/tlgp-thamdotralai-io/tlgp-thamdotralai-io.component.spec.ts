import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TlgpThamdotralaiIoComponent } from './tlgp-thamdotralai-io.component';

describe('TlgpThamdotralaiIoComponent', () => {
  let component: TlgpThamdotralaiIoComponent;
  let fixture: ComponentFixture<TlgpThamdotralaiIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlgpThamdotralaiIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlgpThamdotralaiIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
