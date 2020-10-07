import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TralaigiayphepThongtindangkyComponent } from './tralaigiayphep-thongtindangky.component';

describe('TralaigiayphepThongtindangkyComponent', () => {
  let component: TralaigiayphepThongtindangkyComponent;
  let fixture: ComponentFixture<TralaigiayphepThongtindangkyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TralaigiayphepThongtindangkyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TralaigiayphepThongtindangkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
