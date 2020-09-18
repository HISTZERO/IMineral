import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvucthamdoComponent } from './khuvucthamdo.component';

describe('KhuvucthamdoComponent', () => {
  let component: KhuvucthamdoComponent;
  let fixture: ComponentFixture<KhuvucthamdoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucthamdoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucthamdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
