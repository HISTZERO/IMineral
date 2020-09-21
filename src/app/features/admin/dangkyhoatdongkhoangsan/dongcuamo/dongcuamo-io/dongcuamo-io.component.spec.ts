import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DongcuamoIoComponent } from './dongcuamo-io.component';

describe('DongcuamoIoComponent', () => {
  let component: DongcuamoIoComponent;
  let fixture: ComponentFixture<DongcuamoIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DongcuamoIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DongcuamoIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
