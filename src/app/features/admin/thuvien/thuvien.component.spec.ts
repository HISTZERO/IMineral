import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThuvienComponent } from './thuvien.component';

describe('ThuvienComponent', () => {
  let component: ThuvienComponent;
  let fixture: ComponentFixture<ThuvienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThuvienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThuvienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
