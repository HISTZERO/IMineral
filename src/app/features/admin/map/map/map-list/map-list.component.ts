import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { MatSidenav } from "@angular/material/sidenav";
import { HttpErrorResponse } from "@angular/common/http";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { TranslateService } from "@ngx-translate/core";

import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { MapStatus } from "src/app/shared/constants/map-constants";
import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { InputMapModel } from "src/app/models/admin/map/map.model";
import { InputCategoryModel } from "src/app/models/admin/map/category.model";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { MapIoComponent } from "src/app/features/admin/map/map/map-io/map-io.component";
import {
  _canAddMapListAction,
  _canDeleteMapListAction,
  _canDetailMapListAction,
  _canEditMapListAction,
  _canListMapListAction,
} from "src/app/shared/constants/actions/map/list-map";
import { MenuListMap } from "src/app/shared/constants/sub-menus/map/map";

@Component({
  selector: "app-map-list",
  templateUrl: "./map-list.component.html",
  styleUrls: ["./map-list.component.scss"],
})
export class MapListComponent implements OnInit {
  // Service
  public itemService: any;

  // Paging
  public state: DataStateChangeEventArgs;
  public settingsCommon = new SettingsCommon();

  // Item
  public selectedItem: InputMapModel;
  public listItems: Observable<DataStateChangeEventArgs>;

  // Get all categories
  public categories: InputCategoryModel[];

  // Map status
  public mapStatus = MapStatus;

  // List projection
  public listProjections: Object[] = [];

  // Menu items sub-header
  public navArray = MenuListMap;

  // Data translate
  public dataTranslate: any;

  // Kiểm tra quyền
  canAddMapListAction: boolean = _canAddMapListAction;
  canDeleteMapListAction: boolean = _canDeleteMapListAction;
  canDetailMapListAction: boolean = _canDetailMapListAction;
  canEditMapListAction: boolean = _canEditMapListAction;
  canListMapListAction: boolean = _canListMapListAction;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("ioSidebar", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  constructor(
    public router: Router,
    public cfr: ComponentFactoryResolver,
    public mapFaceService: MapFacadeService,
    public commonService: CommonServiceShared,
    public matsidenavService: MatsidenavService,
    private translate: TranslateService
  ) {
    // Get new service
    this.itemService = this.mapFaceService.getMapService();
  }

  async ngOnInit() {

    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.matsidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );

    await this.getAllItems();
    await this.getAllCategories();
    await this.getListProjections();
  }

  getAllCategories() {
    this.mapFaceService
      .getCategoryService()
      .getAll()
      .subscribe((res) => {
        this.categories = res;
      });
  }

  // Get all
  getAllItems() {
    this.listItems = this.itemService;
    const pageSize = this.settingsCommon.pageSettings.pageSize;
    this.itemService.getDataFromServer({ skip: 0, take: pageSize });
  }

  // Get all projections
  getListProjections() {
    this.mapFaceService
      .getProjectionService()
      .getAll()
      .subscribe((response) => {
        response.map((res) => {
          this.listProjections.push({
            index: res.id,
            name: res.prjName,
          });
        });
      });
  }

  // open sidebar execute insert
  public openIOSidebar() {
    this.matsidenavService.setTitle(this.dataTranslate.MAP.map.titleAdd);
    this.matsidenavService.setContentComp(MapIoComponent, "new", {
      categories: this.categories,
      listProjections: this.listProjections,
    });
    this.matsidenavService.open();
  }

  // edit open sidebar
  public editItem(data) {
    this.matsidenavService.setTitle(this.dataTranslate.MAP.map.titleEdit);
    this.matsidenavService.setContentComp(MapIoComponent, "edit", {
      data: data,
      categories: this.categories,
      listProjections: this.listProjections,
    });
    this.matsidenavService.open();
  }

  // delete
  public deleteItem(data) {
    this.selectedItem = data;
    const canDelete: string = this.mapFaceService
      .getMapService()
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
      this.dataTranslate.MAP.map.contentDelete + ": ",
      this.selectedItem.mapTitle
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.mapFaceService
          .getMapService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllItems(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.MAP.map.notiDeleteSuccess,
                2000
              )
          );
      }
    });
  }

  public detailItem(id) {
    const lstName = AdminRoutingName;
    this.router.navigate([
      `${lstName.adminUri}/${lstName.mapUri}/${lstName.bandoUri}/${id}`,
    ]);
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
