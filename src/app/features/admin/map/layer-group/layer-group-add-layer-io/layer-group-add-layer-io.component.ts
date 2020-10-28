import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { LayerTreeComponent } from "src/app/shared/components/layer-tree/layer-tree.component";
import { TreeGridComponent } from "@syncfusion/ej2-angular-treegrid";

@Component({
  selector: "app-layer-group-add-layer-io",
  templateUrl: "./layer-group-add-layer-io.component.html",
  styleUrls: ["./layer-group-add-layer-io.component.scss"],
})
export class LayerGroupAddLayerIoComponent implements OnInit, AfterViewInit {
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

  // Tree grid
  public treeGrid: TreeGridComponent;

  @ViewChild("layerTree", { static: false }) public layerTree: LayerTreeComponent;

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
    // Translate
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    // List layer ids selected
    this.selectedLayerIds = this.obj.selectedItemIds;

    // Get all layers
    this.getLayers();
  }

  ngAfterViewInit() {
    this.treeGrid = this.layerTree.getTreeGrid();
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
      this.selectedItems = [...this.treeGrid.getCheckedRecords()];
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
        () => this.matSidenavService.doParentFunction("getLayersBelongToGroup"),
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
