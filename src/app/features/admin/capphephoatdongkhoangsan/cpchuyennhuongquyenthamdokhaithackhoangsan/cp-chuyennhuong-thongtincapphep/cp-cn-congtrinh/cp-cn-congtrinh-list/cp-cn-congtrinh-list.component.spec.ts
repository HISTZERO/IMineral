import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpCnCongtrinhListComponent } from './cp-cn-congtrinh-list.component';

describe('CpCnCongtrinhListComponent', () => {
  let component: CpCnCongtrinhListComponent;
  let fixture: ComponentFixture<CpCnCongtrinhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpCnCongtrinhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpCnCongtrinhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
