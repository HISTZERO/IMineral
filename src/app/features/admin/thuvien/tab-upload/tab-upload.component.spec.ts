import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabUploadComponent } from './tab-upload.component';

describe('TabUploadComponent', () => {
  let component: TabUploadComponent;
  let fixture: ComponentFixture<TabUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
