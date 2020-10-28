import { v4 as uuidv4 } from "uuid";
import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";

@Component({
  selector: "app-map-detail-add-layer-group-io",
  templateUrl: "./map-detail-add-layer-group-io.component.html",
  styleUrls: ["./map-detail-add-layer-group-io.component.scss"],
})
export class MapDetailAddLayerGroupIoComponent implements OnInit {
  // public
  public obj: any;
  public treeGroupsAndLayers: any;

  // Group selected
  public selectedItems: any[] = [];
  public selectedParentIds: number[] = [];

  // Data translate
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
    // Translate
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    // Get tree group and layers
    this.treeGroupsAndLayers = await this.getTreeGroupsAndLayers();
    this.selectedParentIds = this.obj.selectedParentIds;
  }

  // Get tree groups and layers
  async getTreeGroupsAndLayers() {
    let treeGroupsAndLayers: any = await this.mapFacadeService
      .getMLayerGroupService()
      .getTreeGroupsAndLayers();

    // Format data
    treeGroupsAndLayers.map((groupLayer) => {
      // Gán thuộc tính
      groupLayer.mapLayerGroupName = groupLayer.mLayerGroupName;
      groupLayer.status = groupLayer.mLayerGroupStatus;
      groupLayer.guid = uuidv4().toUpperCase();
      groupLayer.id = groupLayer.mLayerGroupId;
      groupLayer.name = groupLayer.mapLayerGroupName;
      groupLayer.groupType = groupLayer.mLayerGroupType;
      groupLayer.childs.map((layer) => {
        layer.id = layer.sourceId;
        layer.name = layer.layerTitle;
        layer.guid = uuidv4().toUpperCase();
      });
    });

    return treeGroupsAndLayers;
  }

  public checkedItem: any;
  public checkedStatus: string;

  /**
   * Hàm kích hoạt sự kiện ở layer-tree component
   * @param args - Output
   */
  async rowDataBoundAddLayerGroup(args: any) {
    if (args.eventName === "checkboxChange") {
      // Result data
      this.checkedItem = args.rowData.taskData;
      this.selectedItems = args.checkedRecords;
      this.checkedStatus = args.rowData.checkboxState;

      // Nếu không chọn thêm group cho group nào
      if (this.obj.parentItem.id === null) {
        this.addOrRemoveItem(this.obj.listItems);
      } else {
        this.recursiveAddItem(this.obj.listItems, this.obj.parentItem);
      }
    }
  }

  /**
   * Hàm đệ quy xử lý việc thêm nhóm lớp vào nhóm lớp
   * @param listItems Lớp và nhóm lớp dạng tree
   * @param parentItem Nhóm lớp cha
   */
  recursiveAddItem(listItems, parentItem) {
    listItems.map((item) => {
      if (item.id === parentItem.id) {
        this.addOrRemoveItem(item.childs);
      } else if (item.childs) {
        this.recursiveAddItem(item.childs, parentItem);
      }
    });
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
      });
    }
  }

  // Submit form
  async onSubmit() {
    this.matSidenavService.doParentFunction(
      "updateListItems",
      this.obj.listItems
    );
    this.matSidenavService.close();
  }

  public closeIOSidebar() {
    this.matSidenavService.close();
  }
}
