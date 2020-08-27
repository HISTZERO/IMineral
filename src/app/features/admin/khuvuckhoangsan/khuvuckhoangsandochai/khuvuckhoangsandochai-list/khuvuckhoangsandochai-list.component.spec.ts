import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvuckhoangsandochaiListComponent } from './khuvuckhoangsandochai-list.component';

describe('KhuvuckhoangsandochaiListComponent', () => {
  let component: KhuvuckhoangsandochaiListComponent;
  let fixture: ComponentFixture<KhuvuckhoangsandochaiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuckhoangsandochaiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuckhoangsandochaiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
