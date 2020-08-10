import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { MatSidenav } from "@angular/material/sidenav";
import { HttpErrorResponse } from "@angular/common/http";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { TranslateService } from "@ngx-translate/core";

import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CategoryTypes } from "src/app/shared/constants/map-constants";
import { InputCategoryModel } from "src/app/models/admin/map/category.model";
import { CategoryIoComponent } from "../category-io/category-io.component";
import {
  _canAddCategoriesAction,
  _canDeleteCategoriesAction,
  _canEditCategoriesAction,
  _canListCategoriesAction,
} from "src/app/shared/constants/actions/map/categories";
import { _canListHeToaDoAction } from "src/app/shared/constants/actions/map/hetoado";
import { MenuListCategory } from "src/app/shared/constants/sub-menus/map/category";

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
})
export class CategoryListComponent implements OnInit {
  // Paging
  public state: DataStateChangeEventArgs;
  public settingsCommon = new SettingsCommon();

  // Item
  public selectedItem: InputCategoryModel;
  public listItems: any[];

  // List category select list
  public categoriesInSelect: any[];

  // Category types list
  public categoryTypes = CategoryTypes;

  // Kiểm tra quyền
  canAddCategoriesAction: boolean = _canAddCategoriesAction;
  canDeleteCategoriesAction: boolean = _canDeleteCategoriesAction;
  canEditCategoriesAction: boolean = _canEditCategoriesAction;
  canListCategoriesAction: boolean = _canListCategoriesAction;
  listHeToaDoAction: boolean = _canListHeToaDoAction;

  // Menu items subheader
  public navArray = MenuListCategory;

  // Data translate
  public dataTranslate: any;

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
      .getCategoryService()
      .getAll()
      .subscribe((result) => {
        result.map((res, index) => (res.serialNumber = index + 1));
        this.listItems = result;
        this.categoriesInSelect = this.listItems.map((item) => {
          return { index: item.id, name: item.catName };
        });
      });
  }

  // open sidebar execute insert
  public openIOSidebar() {
    this.matsidenavService.setTitle(this.dataTranslate.MAP.category.titleAdd);
    this.matsidenavService.setContentComp(CategoryIoComponent, "new", {
      categoriesInSelect: this.categoriesInSelect,
    });
    this.matsidenavService.open();
  }

  // edit open sidebar
  public editItem(data) {
    this.matsidenavService.setTitle(this.dataTranslate.MAP.category.titleEdit);
    this.matsidenavService.setContentComp(CategoryIoComponent, "edit", {
      data,
      categoriesInSelect: this.categoriesInSelect,
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
      this.dataTranslate.MAP.category.contentDelete + ": ",
      this.selectedItem.catName
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.mapFaceService
          .getCategoryService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllItems(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.MAP.category.notiDeleteSuccess,
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
