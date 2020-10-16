import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpDongcuamoThongtincapphepComponent } from './cp-dongcuamo-thongtincapphep.component';

describe('CpDongcuamoThongtincapphepComponent', () => {
  let component: CpDongcuamoThongtincapphepComponent;
  let fixture: ComponentFixture<CpDongcuamoThongtincapphepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpDongcuamoThongtincapphepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpDongcuamoThongtincapphepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
