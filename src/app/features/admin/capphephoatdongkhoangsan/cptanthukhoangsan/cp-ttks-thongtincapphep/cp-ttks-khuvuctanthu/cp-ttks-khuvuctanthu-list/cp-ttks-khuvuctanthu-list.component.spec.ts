import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTtksKhuvuctanthuListComponent } from './cp-ttks-khuvuctanthu-list.component';

describe('CpTtksKhuvuctanthuListComponent', () => {
  let component: CpTtksKhuvuctanthuListComponent;
  let fixture: ComponentFixture<CpTtksKhuvuctanthuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTtksKhuvuctanthuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTtksKhuvuctanthuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
