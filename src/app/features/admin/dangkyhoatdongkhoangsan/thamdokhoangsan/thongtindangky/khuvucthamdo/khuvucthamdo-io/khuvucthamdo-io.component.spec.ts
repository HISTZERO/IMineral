import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvucthamdoIoComponent } from './khuvucthamdo-io.component';

describe('KhuvucthamdoIoComponent', () => {
  let component: KhuvucthamdoIoComponent;
  let fixture: ComponentFixture<KhuvucthamdoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucthamdoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucthamdoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
