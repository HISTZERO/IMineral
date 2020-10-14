import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangkydongcuamoIoComponent } from './dangkydongcuamo-io.component';

describe('DangkydongcuamoIoComponent', () => {
  let component: DangkydongcuamoIoComponent;
  let fixture: ComponentFixture<DangkydongcuamoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangkydongcuamoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangkydongcuamoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
