import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongtrinhthamdoIoComponent } from './congtrinhthamdo-io.component';

describe('CongtrinhthamdoIoComponent', () => {
  let component: CongtrinhthamdoIoComponent;
  let fixture: ComponentFixture<CongtrinhthamdoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongtrinhthamdoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongtrinhthamdoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
