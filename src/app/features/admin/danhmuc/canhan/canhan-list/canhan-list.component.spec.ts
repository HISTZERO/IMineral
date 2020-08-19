import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DmCanhanListComponent } from "./canhan-list.component";

describe("CanhanListComponent", () => {
  let component: DmCanhanListComponent;
  let fixture: ComponentFixture<DmCanhanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DmCanhanListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmCanhanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
