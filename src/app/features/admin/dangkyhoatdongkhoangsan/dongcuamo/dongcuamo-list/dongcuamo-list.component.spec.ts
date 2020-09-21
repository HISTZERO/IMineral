import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DongcuamoListComponent } from './dongcuamo-list.component';

describe('DongcuamoListComponent', () => {
  let component: DongcuamoListComponent;
  let fixture: ComponentFixture<DongcuamoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DongcuamoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DongcuamoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
