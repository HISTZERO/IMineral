import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DgqThongtindangkyComponent } from './dgq-thongtindangky.component';

describe('DgqThongtindangkyComponent', () => {
  let component: DgqThongtindangkyComponent;
  let fixture: ComponentFixture<DgqThongtindangkyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DgqThongtindangkyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DgqThongtindangkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
