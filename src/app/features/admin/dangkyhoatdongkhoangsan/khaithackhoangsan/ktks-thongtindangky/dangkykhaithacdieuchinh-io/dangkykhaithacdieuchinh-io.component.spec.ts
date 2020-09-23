import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkykhaithacdieuchinhIoComponent } from './dangkykhaithacdieuchinh-io.component';

describe('DangkykhaithacdieuchinhIoComponent', () => {
  let component: DangkykhaithacdieuchinhIoComponent;
  let fixture: ComponentFixture<DangkykhaithacdieuchinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkykhaithacdieuchinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkykhaithacdieuchinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
