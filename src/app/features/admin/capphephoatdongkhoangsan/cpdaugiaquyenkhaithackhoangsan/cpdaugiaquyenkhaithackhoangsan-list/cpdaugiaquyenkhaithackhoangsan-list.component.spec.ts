import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdongcuamokhoangsanListComponent } from './cpdongcuamokhoangsan-list.component';

describe('CpdongcuamokhoangsanListComponent', () => {
  let component: CpdongcuamokhoangsanListComponent;
  let fixture: ComponentFixture<CpdongcuamokhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpdongcuamokhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpdongcuamokhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
