import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HuonggioListComponent } from './huonggio-list.component';

describe('HuonggioListComponent', () => {
  let component: HuonggioListComponent;
  let fixture: ComponentFixture<HuonggioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HuonggioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuonggioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
