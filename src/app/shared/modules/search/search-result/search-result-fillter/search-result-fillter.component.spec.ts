import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultFillterComponent } from './search-result-fillter.component';

describe('SearchResultFillterComponent', () => {
  let component: SearchResultFillterComponent;
  let fixture: ComponentFixture<SearchResultFillterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultFillterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultFillterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
