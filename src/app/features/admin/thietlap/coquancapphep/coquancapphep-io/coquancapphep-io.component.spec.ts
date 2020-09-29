import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoquancapphepIoComponent } from './coquancapphep-io.component';

describe('CoquancapphepIoComponent', () => {
  let component: CoquancapphepIoComponent;
  let fixture: ComponentFixture<CoquancapphepIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoquancapphepIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoquancapphepIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
