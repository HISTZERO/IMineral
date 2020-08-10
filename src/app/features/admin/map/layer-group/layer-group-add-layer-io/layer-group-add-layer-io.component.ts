import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";

@Component({
  selector: "app-layer-group-add-layer-io",
  templateUrl: "./layer-group-add-layer-io.component.html",
  styleUrls: ["./layer-group-add-layer-io.component.scss"],
})
export class LayerGroupAddLayerIoComponent implements OnInit {
  settingsCommon = new SettingsCommon();

  // public submitted = false;
  public obj: any;
  public purpose: string;

  // List layer ids selected
  public selectedLayerIds: number[] = [];
  public selectedItems: any[] = [];

  // Contain list layers
  public listLayers: any;

  // Data Translate
  public dataTranslate: any;

  constructor(
    public mapFacadeService: MapFacadeService,
    public commonService: CommonServiceShared,
    public matSidenavService: MatsidenavService,
    private translate: TranslateService
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
  }

  async ngOnInit() {
    // Lấy dữ liệu biến translate để gán vào các biến trong component
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    // List layer ids selected
    this.selectedLayerIds = this.obj.selectedItemIds;

    // Get all layers
    this.getLayers();
  }

  // Get layers
  async getLayers() {
    // Get all layers
    let response: any = await this.mapFacadeService
      .getLayerService()
      .getFetchAll({ pageSize: -1, pageNumber: 1 });

    // Format data
    response.items.map((item) => {
      item.name = item.layerTitle;
    });

    this.listLayers = response.items;
  }

  /**
   * Hàm kích hoạt sự kiện ở layer-tree component
   * @param args - Output
   */
  rowDataBound(args: any) {
    if (args.eventName === "checkboxChange") {
      this.selectedItems = [...args.checkedRecords];
    }
  }

  // Submit form
  async onSubmit(args: any) {
    this.mapFacadeService
      .getMLayerGroupService()
      .addItem({
        layerGroupId: this.obj.layerGroupDetailId,
        itemLayerIds: this.selectedItems
          .map((item) => {
            return item.id;
          })
          .join(","),
      })
      .subscribe(
        () => this.matSidenavService.doParentFunction("getAllItems"),
        (error: HttpErrorResponse) => {
          this.commonService.showeNotiResult(error.message, 2000);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.MAP.layerGroupDetail.layerGroupAddLayerSuccess,
            2000
          )
      );
    this.matSidenavService.close();
  }

  public closeIOSidebar() {
    this.matSidenavService.close();
  }
}
