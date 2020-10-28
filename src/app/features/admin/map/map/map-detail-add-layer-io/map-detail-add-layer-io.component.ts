import { v4 as uuidv4 } from "uuid";
import { Component, OnInit } from "@angular/core";

import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";

@Component({
  selector: "app-map-detail-add-layer-io",
  templateUrl: "./map-detail-add-layer-io.component.html",
  styleUrls: ["./map-detail-add-layer-io.component.scss"],
})
export class MapDetailAddLayerIoComponent implements OnInit {

  settingsCommon = new SettingsCommon();

  // public submitted = false;
  public obj: any;
  public purpose: string;

  // List layer ids selected
  public selectedItems: any[] = [];
  public selectedLayerIds: number[] = [];

  // Contain list layers
  public listLayers: any;

  constructor(
    public mapFacadeService: MapFacadeService,
    public commonService: CommonServiceShared,
    public matSidenavService: MatsidenavService,
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
  }

  ngOnInit() {
    // List layer ids selected
    this.selectedLayerIds = this.obj.selectedChildIds;

    // Get all layers
    this.getLayers();
  }

  // Get layers
  async getLayers() {
    let response: any = await this.mapFacadeService
      .getLayerService()
      .getFetchAll({ pageSize: -1, pageNumber: 1 });

    // Format data
    response.items.map(item => {
      item.name = item.layerTitle;
      item.guid = uuidv4().toUpperCase();
    });

    this.listLayers = response.items;
  }

  // Item checked và status checked
  public checkedItem: any;
  public checkedStatus: string;

  /**
   * Hàm kích hoạt sự kiện ở layer-tree component
   * @param args - Output
   */
  async rowDataBound(args: any) {

    if (args.eventName === "checkboxChange") {
      // Result data
      this.checkedItem = args.rowData.taskData;
      this.checkedStatus = args.rowData.checkboxState;

      // Nếu không chọn thêm layer cho group nào
      if (this.obj.parentItem.id === null) {
        this.addOrRemoveItem(this.obj.listItems);
      } else {
        this.recursiveAddItem(this.obj.listItems, this.obj.parentItem);
      }
    }
  }

  /**
   * Hàm đệ quy xử lý việc thêm lớp vào nhóm lớp
   * @param listItems Lớp và nhóm lớp dạng tree
   * @param parentItem Nhóm lớp cha
   */
  recursiveAddItem(listItems, parentItem) {
    listItems.map(item => {
      if (item.childs) {
        if (item.id === parentItem.id) {
          this.addOrRemoveItem(item.childs);
        } else if (item.childs) {
          this.recursiveAddItem(item.childs, parentItem);
        }
      }
    })
  }

  /**
   * Hàm thêm/xóa item trong list item
   * @param listItems Danh sách items checked
   */
  addOrRemoveItem(listItems) {
    if (this.checkedStatus === "check") {
      listItems.push(this.checkedItem);
    } else {
      listItems.map((item, index) => {
        if (item.id === this.checkedItem.id) {
          listItems.splice(index, 1);
        }
      })
    }
  }

  // Submit form
  async onSubmit(args: any) {
    this.matSidenavService.doParentFunction("updateListItems", this.obj.listItems);
    this.matSidenavService.close();
  }

  public closeIOSidebar() {
    this.matSidenavService.close();
  }
}
