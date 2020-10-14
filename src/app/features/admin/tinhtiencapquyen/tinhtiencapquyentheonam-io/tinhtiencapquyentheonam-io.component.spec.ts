import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinhtiencapquyentheonamIoComponent } from './tinhtiencapquyentheonam-io.component';

describe('TinhtiencapquyentheonamIoComponent', () => {
  let component: TinhtiencapquyentheonamIoComponent;
  let fixture: ComponentFixture<TinhtiencapquyentheonamIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinhtiencapquyentheonamIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinhtiencapquyentheonamIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
