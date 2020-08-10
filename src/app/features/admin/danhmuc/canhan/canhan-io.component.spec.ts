import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DmCanhanIoComponent } from "src/app/features/admin/danhmuc/canhan/canhan-io.component";

describe("CanhanIoComponent", () => {
  let component: DmCanhanIoComponent;
  let fixture: ComponentFixture<DmCanhanIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DmCanhanIoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmCanhanIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
