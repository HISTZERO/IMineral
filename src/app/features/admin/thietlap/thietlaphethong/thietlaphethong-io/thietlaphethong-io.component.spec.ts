import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietlaphethongIoComponent } from './thietlaphethong-io.component';

describe('ThietlaphethongIoComponent', () => {
  let component: ThietlaphethongIoComponent;
  let fixture: ComponentFixture<ThietlaphethongIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThietlaphethongIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietlaphethongIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
