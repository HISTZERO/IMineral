import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HuonggioIoComponent } from './huonggio-io.component';

describe('HuonggioIoComponent', () => {
  let component: HuonggioIoComponent;
  let fixture: ComponentFixture<HuonggioIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HuonggioIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuonggioIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
