import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkydongcuadientichIoComponent } from './dangkydongcuadientich-io.component';

describe('DangkydongcuadientichIoComponent', () => {
  let component: DangkydongcuadientichIoComponent;
  let fixture: ComponentFixture<DangkydongcuadientichIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkydongcuadientichIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkydongcuadientichIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
