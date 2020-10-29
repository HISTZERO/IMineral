import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatSidenav } from "@angular/material/sidenav";
import { HttpErrorResponse } from "@angular/common/http";
import {
  DataStateChangeEventArgs,
  RowDDService,
  Grid,
  SelectionService,
  SearchEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { TranslateService } from "@ngx-translate/core";

import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import {
  OutputMapGroupLayerModel,
  InputMapGroupLayerModel,
} from "src/app/models/admin/map/m-group-layer.model";
import {
  LayerTypes,
  LayerStatus,
  LayerGroupStatus,
  LayerGroupTypes,
} from "src/app/shared/constants/map-constants";
import { LayerGroupDetailIoComponent } from "src/app/features/admin/map/layer-group/layer-group-detail-io/layer-group-detail-io.component";
import { LayerGroupAddLayerIoComponent } from "src/app/features/admin/map/layer-group/layer-group-add-layer-io/layer-group-add-layer-io.component";
// import { GroupLayerAction } from "src/app/shared/constants/actions/map/group-layer";
// import { LayerAction } from "src/app/shared/constants/actions/map/layers";
import { MenuListLayerGroupDetail } from "src/app/shared/constants/sub-menus/map/layer-group";
import { ActionGrid } from "src/app/shared/constants/share-component-constants";

@Component({
  selector: "app-layer-group-detail-list",
  templateUrl: "./layer-group-detail-list.component.html",
  styleUrls: ["./layer-group-detail-list.component.scss"],
  providers: [RowDDService, SelectionService],
})
export class LayerGroupDetailListComponent implements OnInit {
  // List layerids selected
  public selectedItemIds: number[] = [];

  // Layer group detail
  private layerGroupDetailId: number;

  // Paging
  public state: DataStateChangeEventArgs;
  public settingsCommon = new SettingsCommon();

  // Item
  public layerGroupDetail: any;
  public selectedItem: InputMapGroupLayerModel;
  public listItems: OutputMapGroupLayerModel[] = [];

  // Layer types and layer status
  public layerTypes = LayerTypes;
  public layerStatus = LayerStatus;

  // Layer group types and layer group status
  public layerGroupStatus = LayerGroupStatus;
  public layerGroupTypes = LayerGroupTypes;

  // Data translate
  public dataTranslate: any;

  // Phân quyền
  public addGroupLayerAction: boolean;
  public editGroupLayerAction: boolean;
  public deleteGroupLayerAction: boolean;
  public listGroupLayerByLayerGroupIdAction: boolean;
  public canListLayersAction: boolean;

  public navArray = MenuListLayerGroupDetail;

  @ViewChild("grid", { static: true }) public grid: Grid;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("ioSidebar", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    public cfr: ComponentFactoryResolver,
    public mapFaceService: MapFacadeService,
    public commonService: CommonServiceShared,
    // public groupLayerAction: GroupLayerAction,
    // public layerAction: LayerAction,
    public matSidenavService: MatsidenavService,
  ) {
    // Layer group detail id
    this.layerGroupDetailId = parseInt(this.route.snapshot.paramMap.get("id"));
  }

  async ngOnInit() {

    // Quyền
    // this.canListLayersAction = await this.layerAction.canListLayersAction();
    // this.addGroupLayerAction = await this.groupLayerAction.addGroupLayerAction();
    // this.editGroupLayerAction = await this.groupLayerAction.editGroupLayerAction();
    // this.deleteGroupLayerAction = await this.groupLayerAction.deleteGroupLayerAction();
    // this.listGroupLayerByLayerGroupIdAction = await this.groupLayerAction.listGroupLayerByLayerGroupIdAction();

    // Translate
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    // Lấy tất cả các layer thuộc group
    this.getLayersBelongToGroup();

    // Cấu hình sidenav io
    this.matSidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );

    // Lấy thông tin group
    this.getLayerGroupDetail();
  }

  /**
   * Lấy danh sách layer thuộc group
   */
  async getLayersBelongToGroup() {
    await this.mapFaceService
      .getMLayerGroupService()
      .getByid(this.layerGroupDetailId)
      .subscribe((res) => {
        if (!res) return;
        this.listItems = res;
        this.selectedItemIds = this.listItems.map(item => item.sourceId);
      });
  }

  /**
   * Lấy thông tin group
   */
  getLayerGroupDetail() {
    this.mapFaceService
      .getLayerGroupService()
      .getByid(this.layerGroupDetailId)
      .subscribe((res) => {
        this.layerGroupDetail = res;
      });
  }

  // open sidebar execute insert
  public openIOSidebar() {
    this.matSidenavService.setTitle(
      this.dataTranslate.MAP.layerGroupDetail.layerGroupAddLayerTitle
    );
    this.matSidenavService.setContentComp(
      LayerGroupAddLayerIoComponent,
      "new",
      {
        layerGroupDetailId: this.layerGroupDetailId,
        selectedItemIds: this.selectedItemIds,
      }
    );
    this.matSidenavService.open();
  }

  // edit open sidebar
  public editItem(data) {
    this.matSidenavService.setTitle(
      this.dataTranslate.MAP.layerGroupDetail.editLayerGroupTitle
    );
    this.matSidenavService.setContentComp(LayerGroupDetailIoComponent, "edit", {
      data,
    });
    this.matSidenavService.open();
  }

  // delete
  public deleteItem(data) {
    this.selectedItem = data;
    const canDelete: string = this.mapFaceService
      .getMLayerGroupService()
      .checkBeDeleted(1);
    this.canBeDeletedCheck(canDelete);
  }

  // Can delete item
  public canBeDeletedCheck(sMsg: string) {
    if (sMsg === "ok") {
      this.confirmDeleteDiaLog();
    } else {
      this.canDeleteDialog(sMsg);
    }
  }

  // Accept delete item
  confirmDeleteDiaLog() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.MAP.mapDetail.mapLayer,
      this.selectedItem.layerName
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.mapFaceService
          .getMLayerGroupService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getLayersBelongToGroup(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.MAP.layerGroupDetail.notiDeleteSuccess,
                2000
              )
          );
      }
    });
  }

  // Cannot delete item
  canDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }

  // Close IO sidebar
  public closeIOSidebar() {
    this.matSidenav.close();
  }

  // Refresh items
  public refreshListItems() {
    this.getLayersBelongToGroup();
  }

  // Xử lý khi search trên grid
  actionBegin(args: SearchEventArgs) {
    if (args.requestType === ActionGrid.search) {
      this.grid.searchSettings.key = this.grid.searchSettings.key.trim();
    }
  }
  
  // Call method
  doFunction(methodName) {
    this[methodName]();
  }

  /**
   * Sự kiện thả một item (sắp xếp grid)
   * @param args Object
   */
  rowDrop(args) {
    setTimeout(() => {

      // Put data
      let layers = [];
      this.grid.getCurrentViewRecords().map((row: any, index) => {
        layers.push({
          id: row.id,
          groupOrder: index + 1,
        });
      });

      // Gọi hàm update lại order
      this.mapFaceService
        .getMLayerGroupService()
        .groupOrder({ layers })
        .subscribe(
          (res) => console.log(res, "res"),
          (error: HttpErrorResponse) => {
            this.commonService.showError(error);
          },
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.MAP.layerGroupDetail.notiEditSuccess,
              2000
            )
        );
    }, 200);
  }
}
