import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TintucIoComponent } from './tintuc-io.component';

describe('TintucIoComponent', () => {
  let component: TintucIoComponent;
  let fixture: ComponentFixture<TintucIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TintucIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TintucIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
