import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryIoComponent } from './category-io.component';

describe('CategoryIoComponent', () => {
  let component: CategoryIoComponent;
  let fixture: ComponentFixture<CategoryIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
