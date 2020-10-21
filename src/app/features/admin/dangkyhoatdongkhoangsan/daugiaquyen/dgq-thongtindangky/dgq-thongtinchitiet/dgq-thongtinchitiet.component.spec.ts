import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DgqThongtinchitietComponent } from './dgq-thongtinchitiet.component';

describe('DgqThongtinchitietComponent', () => {
  let component: DgqThongtinchitietComponent;
  let fixture: ComponentFixture<DgqThongtinchitietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DgqThongtinchitietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DgqThongtinchitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
