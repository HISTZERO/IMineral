import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvuckhoangsandochaiIoComponent } from './khuvuckhoangsandochai-io.component';

describe('KhuvuckhoangsandochaiIoComponent', () => {
  let component: KhuvuckhoangsandochaiIoComponent;
  let fixture: ComponentFixture<KhuvuckhoangsandochaiIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuckhoangsandochaiIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuckhoangsandochaiIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
