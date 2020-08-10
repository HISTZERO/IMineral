import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { MatSidenav } from "@angular/material/sidenav";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { ProjectionStatus } from "src/app/shared/constants/map-constants";
import {
  InputProjectionModel,
} from "src/app/models/admin/map/projection.model";
import { ProjectionIoComponent } from "src/app/features/admin/map/projection/projection-io/projection-io.component";
import {
  _canAddHeToaDoAction,
  _canDeleteHeToaDoAction,
  _canEditHeToaDoAction,
  _canListHeToaDoAction,
} from "src/app/shared/constants/actions/map/hetoado";
import { MenuListProjecttion } from "src/app/shared/constants/sub-menus/map/projection";

@Component({
  selector: "app-projection-list",
  templateUrl: "./projection-list.component.html",
  styleUrls: ["./projection-list.component.scss"],
})
export class ProjectionListComponent implements OnInit {
  // Paging
  public state: DataStateChangeEventArgs;
  public settingsCommon = new SettingsCommon();

  // Item
  public selectedItem: InputProjectionModel;
  public listItems: any[];

  // Data translate
  public dataTranslate: any;

  // Projection status list
  public projectionStatus = ProjectionStatus;

  // Kiểm tra quyền
  canAddHeToaDoAction: boolean = _canAddHeToaDoAction;
  canDeleteHeToaDoAction: boolean = _canDeleteHeToaDoAction;
  canEditHeToaDoAction: boolean = _canEditHeToaDoAction;
  canListHeToaDoAction: boolean = _canListHeToaDoAction;

  public navArray = MenuListProjecttion;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("ioSidebar", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;

  constructor(
    public router: Router,
    public cfr: ComponentFactoryResolver,
    public mapFaceService: MapFacadeService,
    public commonService: CommonServiceShared,
    public matsidenavService: MatsidenavService,
    private translate: TranslateService
  ) { }

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
  }

  // Get all
  async getAllItems() {
    await this.mapFaceService
      .getProjectionService()
      .getAll()
      .subscribe((result) => {
        result.map((res, index) => (res.serialNumber = index + 1));
        this.listItems = result;
      });
  }

  // open sidebar execute insert
  public openIOSidebar() {
    this.matsidenavService.setTitle(this.dataTranslate.MAP.projection.titleAdd);
    this.matsidenavService.setContentComp(ProjectionIoComponent, "new", {});
    this.matsidenavService.open();
  }

  // edit open sidebar
  public editItem(data) {
    this.matsidenavService.setTitle(
      this.dataTranslate.MAP.projection.titleEdit
    );
    this.matsidenavService.setContentComp(ProjectionIoComponent, "edit", {
      data,
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
      this.dataTranslate.MAP.projection.contentDelete + ": ",
      this.selectedItem.prjName
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.mapFaceService
          .getProjectionService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllItems(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.MAP.projection.notiDeleteSuccess,
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
  public refreshlistItems() {
    this.getAllItems();
  }

  // Call method
  doFunction(methodName) {
    this[methodName]();
  }
}
