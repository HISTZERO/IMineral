import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongtrinhthamdoComponent } from './congtrinhthamdo.component';

describe('ContrinhthamdoComponent', () => {
  let component: CongtrinhthamdoComponent;
  let fixture: ComponentFixture<CongtrinhthamdoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongtrinhthamdoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongtrinhthamdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
