import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KhaithackhoangsanIoComponent } from './khaithackhoangsan-io.component';

describe('KhaithackhoangsanIoComponent', () => {
  let component: KhaithackhoangsanIoComponent;
  let fixture: ComponentFixture<KhaithackhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhaithackhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KhaithackhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
