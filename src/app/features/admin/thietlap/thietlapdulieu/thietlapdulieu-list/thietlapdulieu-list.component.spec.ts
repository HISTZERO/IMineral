import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietlapdulieuListComponent } from './thietlapdulieu-list.component';

describe('ThietlapdulieuListComponent', () => {
  let component: ThietlapdulieuListComponent;
  let fixture: ComponentFixture<ThietlapdulieuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThietlapdulieuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietlapdulieuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
