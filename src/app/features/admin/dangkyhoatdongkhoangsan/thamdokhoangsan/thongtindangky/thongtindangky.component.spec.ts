import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongtindangkyComponent } from './thongtindangky.component';

describe('ThongtindangkyComponent', () => {
  let component: ThongtindangkyComponent;
  let fixture: ComponentFixture<ThongtindangkyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThongtindangkyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongtindangkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
