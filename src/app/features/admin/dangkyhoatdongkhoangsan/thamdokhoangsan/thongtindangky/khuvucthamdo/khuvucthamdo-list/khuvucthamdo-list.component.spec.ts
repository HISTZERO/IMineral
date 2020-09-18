import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvucthamdoListComponent } from './khuvucthamdo-list.component';

describe('KhuvucthamdoListComponent', () => {
  let component: KhuvucthamdoListComponent;
  let fixture: ComponentFixture<KhuvucthamdoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvucthamdoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvucthamdoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
