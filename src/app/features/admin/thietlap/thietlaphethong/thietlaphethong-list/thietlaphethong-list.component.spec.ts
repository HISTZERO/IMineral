import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietlaphethongListComponent } from './thietlaphethong-list.component';

describe('ThietlaphethongListComponent', () => {
  let component: ThietlaphethongListComponent;
  let fixture: ComponentFixture<ThietlaphethongListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThietlaphethongListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietlaphethongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
