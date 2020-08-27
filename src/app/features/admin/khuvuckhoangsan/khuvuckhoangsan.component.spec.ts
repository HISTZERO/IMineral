import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhuvuckhoangsanComponent } from './khuvuckhoangsan.component';

describe('KhuvuckhoangsanComponent', () => {
  let component: KhuvuckhoangsanComponent;
  let fixture: ComponentFixture<KhuvuckhoangsanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhuvuckhoangsanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhuvuckhoangsanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
