import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import * as cloneDeep from "lodash.cloneDeep";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { MatSidenav } from "@angular/material/sidenav";

import { MapStatus, MapUnits } from "src/app/shared/constants/map-constants";
import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { GisBaseMapService } from "src/app/services/admin/map/gisbasemap.service";
import { LayerTreeComponent } from "src/app/shared/components/layer-tree/layer-tree.component";
import { MapDetailAddLayerIoComponent } from "src/app/features/admin/map/map/map-detail-add-layer-io/map-detail-add-layer-io.component";
import { MapDetailAddNewGroupIoComponent } from "src/app/features/admin/map/map/map-detail-add-new-group-io/map-detail-add-new-group-io.component";
import { MapDetailEditLayergroupPropertiesComponent } from "../map-detail-edit-layergroup-properties/map-detail-edit-layergroup-properties.component";
import { MapDetailAddLayerGroupIoComponent } from "src/app/features/admin/map/map/map-detail-add-layer-group-io/map-detail-add-layer-group-io.component";
import { MapDetailEditLayerPropertiesComponent } from "src/app/features/admin/map/map/map-detail-edit-layer-properties/map-detail-edit-layer-properties.component";

import { _addLayerGroupsAction } from "src/app/shared/constants/actions/map/layer-groups";
import {
  _canListLayersAction,
  _listLayersGetAllIdNameAction,
} from "src/app/shared/constants/actions/map/layers";
import {
  _addMapLayerLayerIdsAction,
  _addMapLayerLayerGroupIdsAction,
} from "src/app/shared/constants/actions/map/map-layer";
import { MenuListMapDetail } from "src/app/shared/constants/sub-menus/map/map";

@Component({
  selector: "app-map-detail-list",
  templateUrl: "./map-detail-list.component.html",
  styleUrls: ["./map-detail-list.component.scss"],
})
export class MapDetailListComponent implements OnInit {
  public settingsCommon = new SettingsCommon();

  // Map detail
  public mapDetail: any;

  // Item selected
  public selectedItem: any;

  // Map id
  public mapId: number;

  // Projection detail
  public projectionDetail: any;

  // List layer groups
  public listItems: any[] = [];

  // List map status and units
  // Show on select
  public mapUnits = MapUnits;
  public mapStatus = MapStatus;

  // List layer ids selected
  // List group layer ids selected
  public selectedChildIds: number[] = [];
  public selectedParentIds: number[] = [];
  public listLayersAndLayerGroups: Object = {};

  // Save data
  public treeLayer: any[] = [];
  public mapLayers: any[] = [];
  public mapLayerGroups: any[] = [];

  // Data translate
  public dataTranslate: any;

  // Các quyền
  addLayerGroupsAction = _addLayerGroupsAction;
  addMapLayerLayerIdsAction = _addMapLayerLayerIdsAction;
  listLayersGetAllIdNameAction = _listLayersGetAllIdNameAction;
  addMapLayerLayerGroupIdsAction = _addMapLayerLayerGroupIdsAction;

  public navArray = MenuListMapDetail;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild(LayerTreeComponent, { static: false }) child: LayerTreeComponent;
  @ViewChild("ioSidebar", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    public cfr: ComponentFactoryResolver,
    public mapFaceService: MapFacadeService,
    public commonService: CommonServiceShared,
    public matsidenavService: MatsidenavService,
    public gisBaseMapService: GisBaseMapService,
    private translate: TranslateService
  ) {
    // Map id
    this.mapId = parseInt(this.route.snapshot.paramMap.get("id"));
  }

  async ngOnInit() {
    // Lấy dữ liệu biến translate để gán vào các biến trong component
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    // Get map detail by id
    await this.getMapDetail();

    // Sidenav
    this.matsidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );

    // Show map
    await this.showMap();
  }

  // Show map
  async showMap() {
    await this.gisBaseMapService.mapInit("mapShow", this.mapId);
    await this.gisBaseMapService.setView(
      11744206.278690362,
      1827895.5331194468,
      2
    );
  }

  onChangeTab(args: any) {
    this.getLayerAndGroup();
  }

  /**
   * Lấy thông tin bản đồ
   */
  async getMapDetail() {
    this.mapDetail = await this.mapFaceService
      .getMapService()
      .getMapByMapId(this.mapId);
  }

  /**
   * Lấy danh sách layer và group của bản đồ
   * Dựa vào treeLayer json để định dạng lại cây lớp/nhóm lớp
   */
  async getLayerAndGroup() {
    // Lấy tất cả lớp & nhóm lớp của bản đồ
    this.listLayersAndLayerGroups = await this.mapFaceService
      .getMapService()
      .getLayerAndGroup(this.mapId);

    // Convert treeLayer json to object
    if (this.mapDetail.treelayer) {
      this.listItems = JSON.parse(
        this.mapDetail.treelayer.replace(/\\\"/g, '"')
      );
      await this.recursiveFormat(this.listItems);
    }

    // Gọi hàm gán lại giá trị cho treeLayer
    await this.recursiveAddNewProps(
      this.listLayersAndLayerGroups,
      this.listItems
    );
  }

  /**
   * Dùng treeLayer json trong bảng map để sinh ra danh sách
   * lớp và nhóm lớp của bản đồ
   * @param listLayersAndLayerGroups Danh sách layers và groups
   * @param listItems TreeLayer json
   */
  public recursiveAddNewProps(listLayersAndLayerGroups, listItems) {
    if (!listItems) return;
    listItems.map((item) => {
      // Gán thêm props cho item
      Object.keys(listLayersAndLayerGroups[item.guid]).map((key) => {
        if (!item[key]) {
          item[key] = listLayersAndLayerGroups[item.guid][key];
        }
      });

      // Đệ quy
      if (item.childs) {
        this.recursiveAddNewProps(listLayersAndLayerGroups, item.childs);
      }
    });
  }

  /**
   * Hàm callback của các sự kiện bên tree-layer component
   * @param args Giá trị trả về của sự kiện bên tree-layer
   */
  async rowDataBound(event: any) {
    let args: any = await cloneDeep(event);
    switch (args.eventName.trim()) {
      case "update":
        await this.editItem(args.rowData);
        break;
      case "addNewLayerGroup":
        await this.addNewLayerGroup(args.rowData);
        break;
      case "addExistingLayer":
        await this.addExistingLayer(args.rowData);
        break;
      case "addExistingLayerGroup":
        await this.addExistingLayerGroup(args.rowData);
        break;
      case "allRowsHasBeenDisplayed":
        await this.allRowsHasBeenDisplayed(args.currentViewRecords);
        if (!this.isDrop) return;
        await this.treeGridRowDrop(args);
        break;
      case "treeGridRowDrop":
        this.isDrop = true;
        break;
      case "treeGridRowDelete":
        this.treeGridRowDelete(args);
        break;
    }
  }

  public isDrop: boolean = false;

  /**
   * Sau khi người dùng kéo thả
   * @param args Dữ liệu trả về
   */
  async treeGridRowDrop(args: any) {
    await this.calculatingListItems(args.currentViewRecords);
    this.isDrop = false;
  }

  /**
   * Tính toán để render lại list items
   * @param items Các rows
   */
  async calculatingListItems(items: any[]) {
    // First level
    let itemsFirstLevel: any[] = items.filter((item) => {
      return !item.parentItem;
    });

    await this.recursiveSetProps(itemsFirstLevel);

    // Gán lại dữ liệu cho list layer
    this.listItems = cloneDeep(itemsFirstLevel);
  }

  /**
   * Lấy dữ liệu trong prop taskData để gán lại cho item
   * @param itemsFirstLevel Danh sách item
   */
  recursiveSetProps(itemsFirstLevel: any[]) {
    itemsFirstLevel.map((item) => {
      if (item.taskData) {
        // Gán lại giá trị cho childs
        let childs: any = item.childRecords ? cloneDeep(item.childRecords) : [];

        // Gán lại giá trị task data
        let taskData: any = cloneDeep(item.taskData);

        // Xóa props
        Object.keys(item).map((k) => {
          delete item[k];
        });

        // Gán lại props
        Object.keys(taskData).map((key) => {
          item[key] = taskData[key];
        });

        // Đệ quy
        if (childs.length) {
          item.childs = childs;
          this.recursiveSetProps(item.childs);
        }
      }
    });
  }

  public isDelete: boolean = false;

  /**
   * Sau khi người dùng kéo thả
   * @param args Dữ liệu trả về
   */
  async treeGridRowDelete(args: any) {
    // Xóa item
    let listItemsTmp: any[] = cloneDeep(this.listItems);
    await this.recursiveDeleteItem(listItemsTmp, args.rowData.guid);

    // Gán lại giá trị
    this.listItems = listItemsTmp;

    // Format data
    if (this.listItems.length === 0) {
      // Lấy id của các row được chọn
      this.getSelectedItemIds([]);

      // Định dạng dữ liệu để lưu
      this.formatDataToSave([]);
    }
  }

  /**
   * Đệ quy xóa lớp/nhóm lớp
   * @param items Danh sách lớp, nhóm lớp
   * @param deletedItem lớp/nhóm lớp xóa
   */
  async recursiveDeleteItem(items: any[], deletedItemGuid: string) {
    // Lặp qua từng item
    for (let i = 0; i < items.length; i++) {
      // Xóa item
      if (items[i].guid === deletedItemGuid) {
        items.splice(i, 1);
      } else if (items[i].childs) {
        this.recursiveDeleteItem(items[i].childs, deletedItemGuid);
      }
    }
  }

  /**
   * Hàm kích hoạt khi cây layertree đã render xong
   * @param args Giá trị trả về
   */
  allRowsHasBeenDisplayed(currentViewRecords: any) {
    // Lấy id của các row được chọn
    this.getSelectedItemIds(currentViewRecords);

    // Định dạng dữ liệu để lưu
    this.formatDataToSave(currentViewRecords);
  }

  /**
   * Lấy danh sách id của row được chọn
   * @param currentViewRecords Danh sách lớp/nhóm lớp
   */
  getSelectedItemIds(currentViewRecords) {
    this.selectedChildIds = [];
    this.selectedParentIds = [];

    // Danh sách lớp được chọn
    this.selectedChildIds = currentViewRecords
      .filter((item) => {
        return !item.childs;
      })
      .map((item) => {
        return item.id;
      });

    // Danh sách nhóm lớp được chọn
    this.selectedParentIds = currentViewRecords
      .filter((item) => {
        return item.childs;
      })
      .map((item) => {
        return item.id;
      });
  }

  /**
   * Định dạng dữ liệu trước khi lưu
   * @param currentViewRecords Danh sách Danh sách lớp/nhóm lớp
   */
  formatDataToSave(currentViewRecords) {
    // Làm sạch dữ liệu
    this.mapLayers = [];
    this.mapLayerGroups = [];

    currentViewRecords.map((item) => {
      if (item.childs) {
        this.formatGroupToSave(item);
      }
      if (!item.childs) {
        this.formatLayerToSave(item);
      }
    });
  }

  /**
   * Định dạng lại dữ liệu cho group
   * @param item Layer group
   */
  formatGroupToSave(item: any) {
    this.mapLayerGroups.push({
      mapId: this.mapId,
      status: item.status,
      layerGroupId: item.id,
      groupType: item.groupType,
      mapLayerGroupName: item.mapLayerGroupName,
      layerGroupParentId: item.parentItem ? item.parentItem.id : null,
      guid: item.guid,
    });
  }

  /**
   * Định dạng lại dữ liệu cho layer
   * @param item Layer
   */
  formatLayerToSave(item: any) {
    this.mapLayers.push({
      mapId: this.mapId,
      layerGroupId: item.parentItem ? item.parentItem.id : null,
      layerType: item.layerType,
      layerName: item.layerName,
      layerTitle: item.layerTitle,
      description: null,
      opacity: item.opacity,
      sourceId: item.id,
      status: item.status,
      extentMinx: item.extentMinx,
      extentMiny: item.extentMiny,
      extentMaxx: item.extentMaxx,
      extentMaxy: item.extentMaxy,
      minResolution: item.minResolution,
      maxResolution: item.maxResolution,
      baselayer: item.baselayer,
      fieldsInfo: item.fieldsInfo,
      fieldsDisplay: item.fieldsDisplay,
      fieldsInfoFormat: item.fieldsInfoFormat,
      fieldsInfoTemplate: item.fieldsInfoTemplate,
      moreSettings: item.moreSettings,
      guid: item.guid,
    });
  }

  /**
   * Cập nhập lại danh sách lớp/nhóm lớp
   * sau khi thêm lớp/nhóm lớp
   * @param args Giá trị trả về
   */
  async updateListItems(args: any) {
    this.listItems = cloneDeep(args);
  }

  /**
   * Xóa và chỉ giữ lại id, guid, name của lớp/nhóm lớp
   * @param listItems Danh sách lớp và nhóm lớp
   */
  recursiveFormat(listItems) {
    listItems.map((item) => {
      // Gán
      let tmp: any = { ...item };

      // Xóa tất cả các props
      Object.keys(item).map((key) => {
        delete item[key];
      });

      // Set value cho item
      item.id = tmp.id;
      item.guid = tmp.guid;
      item.name = tmp.name;

      // Gọi hàm đệ quy
      if (tmp.childs) {
        item.childs = tmp.childs;
        this.recursiveFormat(item.childs);
      }
    });
  }

  /**
   * Lưu lớp và nhóm lớp cho bản đồ
   */
  async saveLayerAndGroup() {
    // Định dạng lại dữ liệu cho layerTree
    this.treeLayer = cloneDeep(this.listItems);
    await this.recursiveFormat(this.treeLayer);

    await this.mapFaceService
      .getMapService()
      .saveLayerAndGroup({
        mapId: this.mapId,
        mapLayers: this.mapLayers,
        mapLayerGroups: this.mapLayerGroups,
        treeLayer: JSON.stringify(this.treeLayer).replace(/\"/g, '\\"'),
      })
      .subscribe(
        async () => {
          await this.getMapDetail();
          await this.getLayerAndGroup();
        },
        (error: HttpErrorResponse) => {
          this.commonService.showeNotiResult(error.message, 2000);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.MAP.mapDetail.saveSuccess,
            2000
          )
      );
  }

  /**
   * Thêm mới nhóm lớp bản đồ
   */
  addNewLayerGroup(parentItem: any = { id: null, name: "root" }) {
    // Show popup
    this.matsidenavService.setTitle(
      this.dataTranslate.MAP.mapDetail.addNewLayerGroupTitle
    );
    this.matsidenavService.setContentComp(
      MapDetailAddNewGroupIoComponent,
      "new",
      {
        mapId: this.mapId,
        parentItem: parentItem,
        listItems: [...this.listItems],
      }
    );
    this.matsidenavService.open();
  }

  /**
   * Thêm một lớp có sẵn vào bản đồ
   */
  addExistingLayer(
    parentItem: any = { id: null, name: "root", childs: this.listItems }
  ) {
    this.matsidenavService.setTitle(
      this.dataTranslate.MAP.mapDetail.addExistingLayerTitle
    );
    this.matsidenavService.setContentComp(MapDetailAddLayerIoComponent, "new", {
      mapId: this.mapId,
      parentItem: parentItem,
      listItems: [...this.listItems],
      selectedChildIds: this.selectedChildIds,
    });
    this.matsidenavService.open();
  }

  /**
   * Thêm một nhóm lớp có sẵn vào bản đồ
   */
  addExistingLayerGroup(parentItem: any = { id: null, name: "root" }) {
    this.matsidenavService.setTitle(
      this.dataTranslate.MAP.mapDetail.addExistingLayerGroupTitle
    );
    this.matsidenavService.setContentComp(
      MapDetailAddLayerGroupIoComponent,
      "new",
      {
        mapId: this.mapId,
        parentItem: parentItem,
        listItems: [...this.listItems],
        selectedParentIds: this.selectedParentIds,
      }
    );
    this.matsidenavService.open();
  }

  /**
   * Chỉnh sửa tùy chọn hiển thị cho lớp/nhóm lớp
   * @param itemChanged lớp/nhóm lớp bản đồ
   */
  async updateDisplayOptions(itemChanged: any) {
    let listItems: any[] = cloneDeep(this.listItems);
    await this.recursiveUpdateDisplayOptions(listItems, itemChanged);
    this.listItems = listItems;
  }

  /**
   * Đệ quy thay đổi tùy chọn hiển thị
   * @param listItems Danh sách lớp/nhóm lớp
   * @param itemChanged Lớp/nhóm lớp
   */
  recursiveUpdateDisplayOptions(listItems, itemChanged) {
    listItems.map((item) => {
      // Cập nhật lại thông tin
      if (item.guid === itemChanged.guid) {
        Object.keys(itemChanged).map((key) => {
          item[key] = itemChanged[key];
        });
      }

      // Đệ quy
      if (item.childs) {
        this.recursiveUpdateDisplayOptions(item.childs, itemChanged);
      }
    });
  }

  /**
   * Thay đổi thuộc tính lớp của bản đồ
   * @param item Map layer
   */
  editItem(item) {
    if (!item.childs) {
      this.matsidenavService.setTitle(
        this.dataTranslate.MAP.mapDetail.editLayer
      );
      this.matsidenavService.setContentComp(
        MapDetailEditLayerPropertiesComponent,
        "update",
        {
          data: this.listLayersAndLayerGroups[item.guid],
        }
      );
      this.matsidenavService.open();
    } else {
      this.matsidenavService.setTitle(
        this.dataTranslate.MAP.mapDetail.editLayerGroup
      );
      this.matsidenavService.setContentComp(
        MapDetailEditLayergroupPropertiesComponent,
        "update",
        {
          data: this.listLayersAndLayerGroups[item.guid],
        }
      );
      this.matsidenavService.open();
    }
  }

  // Close IO sidebar
  public closeIOSidebar() {
    this.matSidenav.close();
  }

  // Get all layer and group layer
  public reloadAfterEdit() {
    this.getMapDetail();
  }

  // Call method
  doFunction(methodName, resultData: any = {}) {
    this[methodName](resultData);
  }
}
