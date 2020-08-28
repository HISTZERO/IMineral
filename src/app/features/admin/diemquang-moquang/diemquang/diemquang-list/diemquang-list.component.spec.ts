import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiemquangListComponent } from './diemquang-list.component';

describe('DiemquangListComponent', () => {
  let component: DiemquangListComponent;
  let fixture: ComponentFixture<DiemquangListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiemquangListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiemquangListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
