import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoquancapphepListComponent } from './coquancapphep-list.component';

describe('CoquancapphepListComponent', () => {
  let component: CoquancapphepListComponent;
  let fixture: ComponentFixture<CoquancapphepListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoquancapphepListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoquancapphepListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
