import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDaugiakhaithacIoComponent } from './cp-daugiakhaithac-io.component';

describe('CpDaugiakhaithacIoComponent', () => {
  let component: CpDaugiakhaithacIoComponent;
  let fixture: ComponentFixture<CpDaugiakhaithacIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpDaugiakhaithacIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpDaugiakhaithacIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
