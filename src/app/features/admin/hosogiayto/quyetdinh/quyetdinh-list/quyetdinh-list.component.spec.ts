import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetdinhListComponent } from './quyetdinh-list.component';

describe('QuyetdinhListComponent', () => {
  let component: QuyetdinhListComponent;
  let fixture: ComponentFixture<QuyetdinhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuyetdinhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetdinhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
