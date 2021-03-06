import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { DataStateChangeEventArgs, GridComponent, SearchEventArgs } from "@syncfusion/ej2-angular-grids";

import { MatSidenav } from "@angular/material/sidenav";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { InputLayerGroupModel } from "src/app/models/admin/map/layer-group.model";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import {
  LayerGroupStatus,
  LayerGroupTypes,
} from "src/app/shared/constants/map-constants";
import { LayerGroupIoComponent } from "src/app/features/admin/map/layer-group/layer-group-io/layer-group-io.component";
// import { LayerGroupAction } from "src/app/shared/constants/actions/map/layer-groups";
import { MenuListLayerGroup } from "src/app/shared/constants/sub-menus/map/layer-group";
import { ActionGrid } from "src/app/shared/constants/share-component-constants";

@Component({
  selector: "app-layer-group-list",
  templateUrl: "./layer-group-list.component.html",
  styleUrls: ["./layer-group-list.component.scss"],
})
export class LayerGroupListComponent implements OnInit {
  // Service
  public itemService: any;

  // Paging
  public state: DataStateChangeEventArgs;
  public settingsCommon = new SettingsCommon();

  // Item
  public selectedItem: InputLayerGroupModel;
  public listItems: Observable<DataStateChangeEventArgs>;

  // Layer types and layer status
  public layerGroupTypes = LayerGroupTypes;
  public layerGroupStatus = LayerGroupStatus;

  // Get id and name all groups
  groupIdAndGroupName: any[];

  // Data translate
  public dataTranslate: any;

  // Kiểm tra quyền
  public addLayerGroupAction: boolean;
  public deleteLayerGroupsAction: boolean;
  public detailLayerGroupsAction: boolean;
  public editLayerGroupsAction: boolean;
  public listLayerGroupsAction: boolean;

  // Menu items sub-header
  public navArray = MenuListLayerGroup;

  buttonArray = [];

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("ioSidebar", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("grid", {static: false}) public grid: GridComponent;

  constructor(
    public router: Router,
    public cfr: ComponentFactoryResolver,
    public mapFaceService: MapFacadeService,
    public commonService: CommonServiceShared,
    public matSidenavService: MatsidenavService,
    // public layerGroupAction: LayerGroupAction,
    private translate: TranslateService
  ) {
    // Get new service
    this.itemService = this.mapFaceService.getLayerGroupService();
  }

  async ngOnInit() {

    // Quyền
    // this.addLayerGroupAction = await this.layerGroupAction.addLayerGroupsAction();
    // this.deleteLayerGroupsAction = await this.layerGroupAction.deleteLayerGroupsAction();
    // this.detailLayerGroupsAction = await this.layerGroupAction.detailLayerGroupsAction();
    // this.editLayerGroupsAction = await this.layerGroupAction.editLayerGroupsAction();
    // this.listLayerGroupsAction = await this.layerGroupAction.listLayerGroupsAction();

    // Translate
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.getAllItems();
    // Cấu hình sidenav io
    this.matSidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );

    this.getAllItemsWithNotPagination();
  }

  async getAllItemsWithNotPagination() {
    // Get all items
    let result: any = await this.mapFaceService
      .getLayerGroupService()
      .getFetchAll({ pageSize: -1 });

    if (result.items) {
      if (!this.groupIdAndGroupName) this.groupIdAndGroupName = [];

      result.items.map((item) => {
        this.groupIdAndGroupName.push({
          id: item.id,
          name: item.groupName,
        });
      });
    }
  }

  // Get all
  getAllItems() {
    this.listItems = this.itemService;
    const pageSize = this.settingsCommon.pageSettings.pageSize;
    this.itemService.getDataFromServer({ skip: 0, take: pageSize });
  }

  // open sidebar execute insert
  public openIOSidebar() {
    this.matSidenavService.setTitle(
      this.dataTranslate.MAP.layerGroup.addLayerGroup
    );
    this.matSidenavService.setContentComp(LayerGroupIoComponent, "new", {
      groupIdAndGroupName: this.groupIdAndGroupName,
    });
    this.matSidenavService.open();
  }

  // edit open sidebar
  public editItem(data) {
    this.matSidenavService.setTitle(
      this.dataTranslate.MAP.layerGroup.editLayerGroup
    );
    this.matSidenavService.setContentComp(LayerGroupIoComponent, "edit", {
      data,
      groupIdAndGroupName: this.groupIdAndGroupName,
    });
    this.matSidenavService.open();
  }

  public detailItem(id) {
    const lstName = AdminRoutingName;
    this.router.navigate([
      `${lstName.adminUri}/${lstName.mapUri}/${lstName.nhomlopbandoUri}/${id}`,
    ]);
  }

  // delete
  public deleteItem(data) {
    this.selectedItem = data;
    const canDelete: string = this.mapFaceService
      .getLayerGroupService()
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
      this.dataTranslate.MAP.layerGroup.contentDelete + ": ",
      this.selectedItem.groupName
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.mapFaceService
          .getLayerGroupService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllItems(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.MAP.layerGroup.notiDeleteSuccess,
                2000
              )
          );
      }
    });
  }

  // When page item clicked
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.itemService.getDataFromServer(state);
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
  public refreshlistItems() {
    this.getAllItems();
  }

  // Call method
  doFunction(methodName) {
    this[methodName]();
  }
}
