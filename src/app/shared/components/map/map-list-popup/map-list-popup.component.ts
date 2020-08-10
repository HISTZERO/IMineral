import { SplitComponent } from "angular-split";
import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogRef,
} from "@angular/material/dialog";

import { MapStatus } from "src/app/shared/constants/map-constants";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";

@Component({
  selector: "app-map-list-popup",
  templateUrl: "./map-list-popup.component.html",
  styleUrls: ["./map-list-popup.component.scss"],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  ],
})
export class MapListPopupComponent implements OnInit {

  listMap: any[] = [];
  listMapShow: any[] = [];
  treeCategories: any[] = [];

  mapStatus = MapStatus;
  useTransition: boolean = true;

  // Danh sách areas trong layout
  areas = [
    { size: 30, order: 1 },
    { size: 70, order: 2 },
  ];

  @ViewChild("mySplit", { static: false }) mySplitEl: SplitComponent;
  constructor(
    public dialogRef: MatDialogRef<any>,
    public mapFaceService: MapFacadeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    // Lấy tất cả bản đồ
    this.getAllMaps();

    // Lấy tất cả categories
    this.getTreeCategories();
  }

  /**
   * Hàm lấy danh sách categories
   * Đối tượng trả về dạng cây
   */
  async getTreeCategories() {
    let result: any = await this.mapFaceService
      .getCategoryService()
      .getTreeCategories();
    this.treeCategories = result;
  }

  /**
   * Hàm lấy tất cả bản đồ
   */
  async getAllMaps() {

    // Gọi api
    let result: any = await this.mapFaceService
      .getMapService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });

    // Định dạng dữ liệu
    if (result && result.items) {

      // Gán giá trị
      let listMap: any[] = result.items;

      // Cat ids
      listMap.map(map => {
        map.catIds = map.categories.map(cat => cat.id);
      });

      // Lấy những bản đồ có status = 1
      listMap = listMap.filter(map => {
        return map.status;
      })

      // Gán giá trị cho list maps
      this.listMap = listMap;
    }
  }

  async rowDataBound(args: any) {

    if ([
      'checkboxChange',
      'allRowsHasBeenDisplayed'
    ].indexOf(args.eventName) === -1) {
      return;
    }

    // Danh sách category ids đã được chọn
    let selectedCatIds = args.checkedRecords.map((record) => {
      return record.id;
    });

    // Duyệt qua từng bản đồ
    this.listMapShow = this.listMap.filter((map) => {
      // Duyệt qua từng bản đồ
      // Kiểm tra bản đồ có catid nằm trong danh sách
      // các nhóm bản đồ đã được chọn không
      let isExists = false;
      map.catIds.map((catId) => {
        if (selectedCatIds.indexOf(catId) !== -1) {
          isExists = true;
          return;
        }
      });
      return isExists;
    });
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