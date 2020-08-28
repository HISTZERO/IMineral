import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiemquangMoquangComponent } from './diemquang-moquang.component';

describe('DiemquangMoquangComponent', () => {
  let component: DiemquangMoquangComponent;
  let fixture: ComponentFixture<DiemquangMoquangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiemquangMoquangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiemquangMoquangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
