import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinhtiencapquyenComponent } from './tinhtiencapquyen.component';

describe('TinhtiencapquyenComponent', () => {
  let component: TinhtiencapquyenComponent;
  let fixture: ComponentFixture<TinhtiencapquyenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinhtiencapquyenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinhtiencapquyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
