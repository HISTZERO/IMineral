import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PheduyettruluongkhoangsanIoComponent } from './pheduyettruluongkhoangsan-io.component';

describe('PheduyettruluongkhoangsanIoComponent', () => {
  let component: PheduyettruluongkhoangsanIoComponent;
  let fixture: ComponentFixture<PheduyettruluongkhoangsanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PheduyettruluongkhoangsanIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PheduyettruluongkhoangsanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
