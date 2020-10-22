import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpCnCongtrinhIoComponent } from './cp-cn-congtrinh-io.component';

describe('CpCnCongtrinhIoComponent', () => {
  let component: CpCnCongtrinhIoComponent;
  let fixture: ComponentFixture<CpCnCongtrinhIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpCnCongtrinhIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpCnCongtrinhIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
