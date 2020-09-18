import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongtrinhthamdoListComponent } from './congtrinhthamdo-list.component';

describe('CongtrinhthamdoListComponent', () => {
  let component: CongtrinhthamdoListComponent;
  let fixture: ComponentFixture<CongtrinhthamdoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongtrinhthamdoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongtrinhthamdoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
