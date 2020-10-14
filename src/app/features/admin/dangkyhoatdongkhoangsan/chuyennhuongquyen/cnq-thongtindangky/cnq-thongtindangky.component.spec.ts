import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CnqThongtindangkyComponent } from './cnq-thongtindangky.component';

describe('CnqThongtindangkyComponent', () => {
  let component: CnqThongtindangkyComponent;
  let fixture: ComponentFixture<CnqThongtindangkyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CnqThongtindangkyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnqThongtindangkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
