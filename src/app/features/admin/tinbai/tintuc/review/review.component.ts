import { Component, OnInit, Input } from "@angular/core";
import { MenuTinBaiTinTucReview } from "src/app/shared/constants/sub-menus/tinbai/tinbai";

import { TinbaiFacadeService } from "src/app/services/admin/tinbai/tinbai-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { InputTintucModel } from "src/app/models/admin/tinbai/tintuc.model";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";

@Component({
  selector: "app-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.scss"],
})
export class ReviewComponent implements OnInit {
  // public submitted = false;
  public obj: any;
  public inputModel: InputTintucModel;
  public navArray: any = MenuTinBaiTinTucReview;

  // Các biến của đối tượng tin tức
  private tinTucId: number;
  public title: string;
  public author: string;
  public content: string;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public tbFacadeService: TinbaiFacadeService,
    public commonService: CommonServiceShared,
    public matSidenavService: MatsidenavService
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
  }

  ngOnInit() {
    // lấy id của tin tức từ url
    this.tinTucId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.getTinTucById();
  }

  // Lấy tin tức theo id từ url và bind vào form
  getTinTucById() {
    this.tbFacadeService
      .getTbTintucService()
      .getByid(this.tinTucId)
      .subscribe((res) => {
        this.obj = res;
        this.title = this.obj.title;
        this.author = this.obj.author;
        this.content = this.obj.content;
      });
  }
}
