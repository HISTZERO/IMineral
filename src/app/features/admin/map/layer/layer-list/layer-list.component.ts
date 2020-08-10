import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Observable } from "rxjs";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";

import {
  LayerStatus,
  LayerTypes,
} from "src/app/shared/constants/map-constants";
import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { InputLayerModel } from "src/app/models/admin/map/layer.model";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { LayerIoComponent } from "src/app/features/admin/map/layer/layer-io/layer-io.component";
import {
  _canAddLayersAction,
  _canDeleteLayersAction,
  _canDetailLayersAction,
  _canEditLayersAction,
  _canListLayersAction,
} from "src/app/shared/constants/actions/map/layers";
import { _canListHeToaDoAction } from "src/app/shared/constants/actions/map/hetoado";
import { MenuListLayer } from "src/app/shared/constants/sub-menus/map/layer";

@Component({
  selector: "app-layer-list",
  templateUrl: "./layer-list.component.html",
  styleUrls: ["./layer-list.component.scss"],
})
export class LayerListComponent implements OnInit {
  // Service
  public itemService: any;

  // Paging
  public state: DataStateChangeEventArgs;
  public settingsCommon = new SettingsCommon();

  // Item
  public selectedItem: InputLayerModel;
  public listItems: Observable<DataStateChangeEventArgs>;

  // Layer types and layer status
  public layerTypes = LayerTypes;
  public layerStatus = LayerStatus;

  // Kiểm tra quyền
  canAddLayersAction: boolean = _canAddLayersAction;
  canDeleteLayersAction: boolean = _canDeleteLayersAction;
  canEditLayersAction: boolean = _canEditLayersAction;
  canListLayersAction: boolean = _canListLayersAction;
  listHeToaDoAction: boolean = _canListHeToaDoAction;

  // List projection
  public listProjections: Object[] = [];

  // Data translate
  public dataTranslate: any;

  // Menu item sub header
  public navArray = MenuListLayer;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("ioSidebar", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;

  constructor(
    public cfr: ComponentFactoryResolver,
    public mapFaceService: MapFacadeService,
    public commonService: CommonServiceShared,
    public matsidenavService: MatsidenavService,
    private translate: TranslateService
  ) {
    // Get new service
    this.itemService = this.mapFaceService.getLayerService();
  }

  async ngOnInit() {
    // Lấy dữ liệu biến translate để gán vào các biến trong component
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.getAllItems();
    this.matsidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );
    this.getListProjections();
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
    this.matsidenavService.setTitle(this.dataTranslate.MAP.layer.titleAdd);
    this.matsidenavService.setContentComp(LayerIoComponent, "new", {
      listProjections: this.listProjections,
    });
    this.matsidenavService.open();
  }

  // edit open sidebar
  public editItem(data) {
    this.matsidenavService.setTitle(this.dataTranslate.MAP.layer.titleEdit);
    this.matsidenavService.setContentComp(LayerIoComponent, "edit", {
      data: data,
      listProjections: this.listProjections,
    });
    this.matsidenavService.open();
  }

  // delete
  public deleteItem(data) {
    this.selectedItem = data;
    const canDelete: string = this.mapFaceService
      .getLayerService()
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
      this.dataTranslate.MAP.layer.contentDelete + ": ",
      this.selectedItem.layerTitle
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.mapFaceService
          .getLayerService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllItems(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.MAP.layer.notiDeleteSuccess,
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
