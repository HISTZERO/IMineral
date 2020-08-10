import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmThamsoIoComponent } from './thamso-io.component';

describe('DmThamsoIoComponent', () => {
  let component: DmThamsoIoComponent;
  let fixture: ComponentFixture<DmThamsoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmThamsoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmThamsoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
