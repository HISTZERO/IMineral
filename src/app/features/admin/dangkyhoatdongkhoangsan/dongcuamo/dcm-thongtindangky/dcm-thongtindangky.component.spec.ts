import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcmThongtindangkyComponent } from './dcm-thongtindangky.component';

describe('DcmThongtindangkyComponent', () => {
  let component: DcmThongtindangkyComponent;
  let fixture: ComponentFixture<DcmThongtindangkyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcmThongtindangkyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcmThongtindangkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
