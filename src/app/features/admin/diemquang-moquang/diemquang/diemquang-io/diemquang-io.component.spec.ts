import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiemquangIoComponent } from './diemquang-io.component';

describe('DiemquangIoComponent', () => {
  let component: DiemquangIoComponent;
  let fixture: ComponentFixture<DiemquangIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiemquangIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiemquangIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
