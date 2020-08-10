import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultDataComponent } from './search-result-data.component';

describe('SearchResultDataComponent', () => {
  let component: SearchResultDataComponent;
  let fixture: ComponentFixture<SearchResultDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
