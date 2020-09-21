import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PheduyettruluongkhoangsanListComponent } from './pheduyettruluongkhoangsan-list.component';

describe('PheduyettruluongkhoangsanListComponent', () => {
  let component: PheduyettruluongkhoangsanListComponent;
  let fixture: ComponentFixture<PheduyettruluongkhoangsanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PheduyettruluongkhoangsanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PheduyettruluongkhoangsanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
