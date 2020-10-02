import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdongcuamokhoangsanIoComponent } from './cpdongcuamokhoangsan-io.component';

describe('CpdongcuamokhoangsanIoComponent', () => {
  let component: CpdongcuamokhoangsanIoComponent;
  let fixture: ComponentFixture<CpdongcuamokhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpdongcuamokhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdongcuamokhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
