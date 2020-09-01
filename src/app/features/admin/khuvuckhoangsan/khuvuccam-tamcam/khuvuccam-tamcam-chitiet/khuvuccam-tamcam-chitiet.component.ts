import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { KhuvuccamTamcamIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuccam-tamcam/khuvuccam-tamcam-io/khuvuccam-tamcam-io.component";
import { OutputKhuVucCamTamCamModel } from "../../../../../models/admin/khuvuckhoangsan/khuvuccamtamcam.model";
import { KhuVucKhoangSanFacadeService } from "../../../../../services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";

@Component({
  selector: 'app-khuvuccam-tamcam-chitiet',
  templateUrl: './khuvuccam-tamcam-chitiet.component.html',
  styleUrls: ['./khuvuccam-tamcam-chitiet.component.scss']
})
export class KhuvuccamTamcamChitietComponent implements OnInit {
  // Chứa id khu vực cấm, tạm cấm
  public idKhuVuc: string;

  // Các biến translate
  public dataTranslate: any;

  // Chứa dữ liệu khu vực cấm, tạm cấm
  public obj: OutputKhuVucCamTamCamModel;

  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public commonFacadeService: CommonFacadeService,
    private translate: TranslateService,
    public khuvuckhoangsanFacadeService: KhuVucKhoangSanFacadeService,
  ) {
    console.log("constructor - khuvuccam-tamcam-chitiet");
  }

  async ngOnInit() {
    console.log("ngOnInit - khuvuccam-tamcam-chitiet");
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    console.log(this.idKhuVuc);
    this.getDataKhuVucCamTamCamById();
  }

  /**
   * Lấy dữ liệu
   */
  async getDataKhuVucCamTamCamById() {
    await this.khuvuckhoangsanFacadeService
      .getKhuVucCamTamCamService()
      .getByid(this.idKhuVuc).subscribe(res => {
        this.obj = res;
      });
  }
}
