import { v4 as uuidv4 } from "uuid";
import { SplitComponent } from "angular-split";
import { Component, OnInit, Inject, ViewChild, OnDestroy } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogRef,
} from "@angular/material/dialog";

import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { GisAdvanceMapService } from "src/app/services/admin/map/gis-advance-map.service";

@Component({
  selector: "app-layer-list-popup",
  templateUrl: "./layer-list-popup.component.html",
  styleUrls: ["./layer-list-popup.component.scss"],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  ],
})
export class LayerListPopupComponent implements OnInit, OnDestroy {

  layerDetail: any;
  selectedItem: any;
  treeGroupsAndLayers: any[];
  selectedLayerIds: number[];
  useTransition: boolean = true;

  @ViewChild("mySplit", { static: false }) mySplitEl: SplitComponent;

  // Gis advance map service
  private gisAdvanceMapService: GisAdvanceMapService;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mapFacadeService: MapFacadeService
  ) {
    this.gisAdvanceMapService = this.mapFacadeService.getGisAdvanceMapService();
  }

  async ngOnInit() {

    this.selectedLayerIds = this.data.selectedChildIds;

    // Layer được chọn
    if (this.data.selectedItem) {
      this.layerDetail = this.data.selectedItem;
      this.selectedItem = this.data.selectedItem;
    }

    // Hiển thị bản đồ
    this.gisAdvanceMapService.mapInit("mapViewPopup");
    this.gisAdvanceMapService.setView(
      "11744206.278690362, 1827895.5331194468",
      4
    );

    await this.getTreeGroupsAndLayers();
  }

  /**
 * Hàm lấy danh sách group và layer của group
 * Đối tượng trả về dạng cây
 */
  async getTreeGroupsAndLayers() {

    // Get layer and childs
    let treeGroupsAndLayers: any = await this.mapFacadeService
      .getMLayerGroupService()
      .getTreeGroupsAndLayers();

    // Format data
    await treeGroupsAndLayers.map(groupLayer => {
      // Gán thuộc tính
      groupLayer.mapLayerGroupName = groupLayer.mLayerGroupName;
      groupLayer.status = groupLayer.mLayerGroupStatus;
      groupLayer.guid = uuidv4().toUpperCase();
      groupLayer.id = groupLayer.mLayerGroupId;
      groupLayer.name = groupLayer.mapLayerGroupName;
      groupLayer.groupType = groupLayer.mLayerGroupType;
      groupLayer.childs.map(layer => {
        layer.id = layer.sourceId;
        layer.name = layer.layerTitle;
        layer.guid = uuidv4().toUpperCase();
      })
    });

    // Get all layers
    let result: any = await this.mapFacadeService
      .getLayerService()
      .getFetchAll({ pageSize: -1, pageNumber: 1 });

    if (result.items) {
      await result.items.map(layer => {
        layer.id = layer.id;
        layer.name = layer.layerTitle;
        layer.guid = uuidv4().toUpperCase();
        treeGroupsAndLayers.push(layer);
      })
    }

    this.treeGroupsAndLayers = treeGroupsAndLayers;
  }

  ngOnDestroy() {
    delete this.gisAdvanceMapService;
  }

  // Danh sách areas trong layout
  areas = [
    { size: 30, order: 1 },
    { size: 70, order: 2 },
  ];

  log(type: string, e: { gutterNum: number; sizes: Array<number> }) {
    this.gutterClick();
  }

  /**
   * Hàm callback khi click checkbox phần tree layer
   */
  rowDataBound(args: any) {

    let guid: string = uuidv4().toUpperCase();
    if (this.selectedItem) {
      guid = this.selectedItem.guid;
    }

    if (args.rowData) {

      // Lấy item
      this.mapFacadeService
        .getLayerService()
        .getByid(args.rowData.id)
        .subscribe((res) => {

          // Thêm các thuộc tính cho layer
          res.guid = guid;
          res.isShow = true;
          res.index = args.rowData.index;
          res.opacity = res.opacity ? res.opacity : 1;

          // Show layer trên bản đồ
          if (args.eventName === "treeGridRowSelected") {
            this.layerDetail = res;
            this.gisAdvanceMapService.removeAllLayers();
            this.gisAdvanceMapService.processAddNewLayer(res);
          }

          // Thêm lớp vào bản đồ
          if (args.eventName === "add") {
            this.dialogRef.close({ item: res, eventName: args.eventName });
          }

          // Xóa lớp khỏi bản đồ
          if (args.eventName === "remove") {
            this.dialogRef.close({ item: args.rowData, eventName: args.eventName });
          }
        });
    }
  }

  /**
   * Đóng/mở phần bên trái của layout
   */
  gutterClick() {
    if (this.areas[0].size > 0) {
      this.areas[0].size = 0;
      this.areas[1].size = 100;
    } else {
      this.areas[0].size = 30;
      this.areas[1].size = 70;
    }
  }
}