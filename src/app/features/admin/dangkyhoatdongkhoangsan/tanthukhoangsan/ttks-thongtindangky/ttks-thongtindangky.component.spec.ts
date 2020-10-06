import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtksThongtindangkyComponent } from './ttks-thongtindangky.component';

describe('TtksThongtindangkyComponent', () => {
  let component: TtksThongtindangkyComponent;
  let fixture: ComponentFixture<TtksThongtindangkyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtksThongtindangkyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtksThongtindangkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
