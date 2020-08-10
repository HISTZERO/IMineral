import { SplitComponent } from "angular-split";
import { MatAccordion } from "@angular/material";
import { MatDialog } from "@angular/material/dialog";
import * as cloneDeep from "lodash/cloneDeep";
import { TranslateService } from "@ngx-translate/core";
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  HostListener,
  Input,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "src/app/services/auth/auth.service";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { ProgressService } from "src/app/services/progress/progress.service";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { GisAdvanceMapService } from "src/app/services/admin/map/gis-advance-map.service";
import {
  Widgets,
  WidgetItems,
  CallbackTypes,
} from "src/app/shared/constants/map-constants";
import { MapListPopupComponent } from "src/app/shared/components/map/map-list-popup/map-list-popup.component";
import { LayerListPopupComponent } from "src/app/shared/components/map/layer-list-popup/layer-list-popup.component";

@Component({
  selector: "app-map-detail",
  templateUrl: "./map-detail.component.html",
  styleUrls: ["./map-detail.component.scss"],
})
export class MapDetailComponent implements OnInit {
  @Input() mapHeight: string;

  useTransition: boolean = true;

  // Map id
  mapId: string;

  // Lưu map
  currentMap: any = {};

  // Tab hiện thị
  matTabIndex: number = 0;

  // Danh sách widgets
  listWidgets = Widgets;

  // Ẩn/hiện widget
  showWidget: boolean = false;

  // Lớp bản đồ
  allLayers: any = [];

  // Danh sách layers hiển thị
  layersDisplayOnMap: any[];

  // Danh sách group và layer
  treeLayersAndGroups: any[];

  // Danh sách layer được thêm vào
  extendedLayers: any[] = [];

  // Lưu entry component factory
  entryComponentFactory: any;

  // Danh sách areas trong layout
  public areas = [
    { size: 0, order: 1 },
    { size: 100, order: 2 },
  ];

  public items: any[] = [];

  @ViewChild("accordion", { static: true }) accordion: MatAccordion;
  @ViewChild("mySplit", { static: false }) mySplitEl: SplitComponent;

  // Tắt mở danh sách widgets
  @ViewChild("insideElement", { static: false }) insideElement;

  // Container chứa widget
  @ViewChild("floatWidget", { static: true, read: ViewContainerRef })
  floatWidget: ViewContainerRef;

  // Sự kiện click trên màn hình
  @HostListener("document:click", ["$event.target"]) hostListener(
    targetElement
  ) {
    // Ẩn widget khi click ra ngoài khu vực widgets
    if (
      this.insideElement &&
      !this.insideElement.nativeElement.contains(targetElement)
    ) {
      this.showWidget = false;
    }
  }

  // Data translate
  public dataTranslate: any;

  // Gis advance map service
  private gisAdvanceMapService: GisAdvanceMapService;

  constructor(
    public router: Router,
    private dialog: MatDialog,
    public route: ActivatedRoute,
    public authService: AuthService,
    public progressSerivce: ProgressService,
    private mapFaceService: MapFacadeService,
    private resolver: ComponentFactoryResolver,
    private translate: TranslateService
  ) {
    // Map service
    this.gisAdvanceMapService = mapFaceService.getGisAdvanceMapService();

    // Trigger get feature info
    this.triggerGetFeatureInfos();
  }

  async ngOnInit() {

    // Lấy dữ liệu biến translate để gán vào các biến trong component
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.route.params.subscribe(async (val) => {
      this.items = [
        {
          id: "1",
          text: this.dataTranslate.PUBLIC.mapDetail.layerInfo,
          iconCss: "fa fa-comment",
        },
        {
          id: "2",
          text: this.dataTranslate.PUBLIC.mapDetail.deleteLayer,
          iconCss: "fa fa-trash",
        },
      ];

      // Format
      this.extendedLayers = [];
      this.layersDisplayOnMap = [];

      // Remove all layers
      this.gisAdvanceMapService.removeAllLayers();

      // Map detail
      this.getMapDetail();
    });

    // Hiển thị bản đồ
    this.showMap();

    // Hàm khởi tạo các widget
    this.initWidget();

    this.getMapDetail();
  }

  /**
   * Hàm callback sau khi lấy feature infos
   */
  triggerGetFeatureInfos() {
    // Lắng nghe callback khi hàm get feature info xử lý xong
    this.gisAdvanceMapService.componentMethodCalled$.subscribe((response) => {
      if (response.type === CallbackTypes.FEATURE) {
      }
    });
  }

  /**
   * Hiển thị bản đồ
   * Thêm lớp vào bản đồ
   * Thêm legend
   * @param mapLayers Danh sách lớp bản đồ
   */
  async showMap() {
    await this.gisAdvanceMapService.mapInit("mapView");
    await this.gisAdvanceMapService.setView(
      "11744206.278690362, 1827895.5331194468",
      4
    );
  }

  /**
   * Hàm khởi tạo widget
   * Hiển thị những widget có display = true
   */
  initWidget() {
    this.listWidgets.map((widget) => {
      this.clickOnWidget(widget);
    });
  }

  /**
   * Ẩn/hiện widget
   * @param event Event click
   * @param widget Đối tượng widget đang được click
   */
  clickOnWidget(widget, event?) {
    if (event) {
      event.stopPropagation();
      widget.display = !widget.display;
    }

    switch (widget.slug) {
      case WidgetItems.ZOOM_BOX:
        this.gisAdvanceMapService.toggleZoomBoxWidget(widget);
        break;
      case WidgetItems.GET_FEATURE_INFO:
        this.gisAdvanceMapService.toggleFeatureInfoWidget(widget);
        break;
      case WidgetItems.SKETCH:
        this.gisAdvanceMapService.toggleSketchWidget(widget);
        break;
      case WidgetItems.STATISTICS:
        this.gisAdvanceMapService.toggleStatisticsWidget(widget);
        break;
      case WidgetItems.BASE_MAP:
        this.gisAdvanceMapService.toggleBaseMapWidget(widget);
        break;
      case WidgetItems.ADD_LAYER:
        widget.mapDetailComponent = this;
        this.gisAdvanceMapService.toggleAddLayerWidget(widget);
        break;
    }
  }

  /**
   * Kiểm tra có id bản đồ trên url?
   * Nếu tồn tại thì show dữ liệu bản đồ ra bản đồ nền
   */
  async getMapDetail() {
    // Id bản đồ
    this.mapId = this.route.snapshot.paramMap.get("id");

    // Lấy thông tin bản đồ
    if (this.mapId) {
      this.currentMap = await this.mapFaceService
        .getMapService()
        .getMapByMapId(parseInt(this.mapId));

      if (this.currentMap.id) {
        this.getLayersAndGroups(this.currentMap.id);
      }
    }
  }

  /**
   * Hàm lấy danh sách các group và layer bản đồ
   * @param mapId Id của bản đồ
   */
  async getLayersAndGroups(mapId) {
    // Lấy tất cả lớp/nhóm lớp của bản đồ
    let layerAndGroup: any = await this.mapFaceService
      .getMapService()
      .getLayerAndGroup(mapId);

    // Lấy tất cả các lớp
    let resultGetLayers: any = await this.mapFaceService
      .getLayerService()
      .getFetchAll({ pageSize: -1, pageNumber: 1 });

    // Contain layers
    if (resultGetLayers.items) {
      resultGetLayers.items.map((layer) => {
        this.allLayers[layer.id] = layer;
      });
    }

    if (layerAndGroup) {
      // Convert treeLayer json to object
      if (this.currentMap.treelayer) {
        // Dạng json
        this.treeLayersAndGroups = JSON.parse(
          this.currentMap.treelayer.replace(/\\\"/g, '"')
        );

        // Gọi hàm gán lại giá trị cho treeLayer
        await this.recursiveAddNewProps(
          layerAndGroup,
          this.treeLayersAndGroups
        );
      }
    }

    // Hiển thị vùng có lớp/nhóm lớp và chú giải
    this.areas[0].size = 20;
    this.areas[1].size = 80;
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
      if (listLayersAndLayerGroups[item.guid]) {
        Object.keys(listLayersAndLayerGroups[item.guid]).map((key) => {
          if (!item[key]) {
            item[key] = listLayersAndLayerGroups[item.guid][key];
          }
        });
      }

      // Đệ quy
      if (item.childs) {
        this.recursiveAddNewProps(listLayersAndLayerGroups, item.childs);
      }
    });
  }

  /**
   * Hàm callback khi đóng modal chọn bản đồ
   */
  openMapDialog() {
    const dialogRef = this.dialog.open(MapListPopupComponent, {});
    dialogRef.afterClosed().subscribe((map) => {
      if (map) {
        this.router.navigate([`${AdminRoutingName.bandoUri}/${map.id}`]);
      }
    });
  }

  async showLayersOnMap(checkedRecords: any[]) {
    // Lấy danh sách layer từ tree layer group
    this.layersDisplayOnMap = await cloneDeep(checkedRecords).filter(
      (record) => {
        return record.sourceId;
      }
    );

    // Gán thêm thuộc tính
    await this.layersDisplayOnMap.map((record) => {
      if (this.allLayers[record.sourceId]) {
        Object.keys(this.allLayers[record.sourceId]).map((key) => {
          if (!record[key]) {
            record[key] = this.allLayers[record.sourceId][key];
          }
        });
      }
    });

    // Hiển thị lớp bản đồ
    await this.gisAdvanceMapService.processAddLayer([
      ...this.layersDisplayOnMap.reverse(),
      ...this.extendedLayers,
    ]);
  }

  /**
   * Hàm kích hoạt sự kiện ở layer-tree component
   * @param args - Output
   */
  rowDataBound(args: any) {
    switch (args.eventName) {
      case "checkboxChange":
      case "allRowsHasBeenDisplayed":
        this.showLayersOnMap(args.checkedRecords);
        break;

      default:
        break;
    }
  }

  /**
   * Đóng/mở phần bên trái của layout
   */
  gutterClick(index) {
    if (this.areas[0].size > 0) {
      this.areas[0].size = 0;
      this.areas[1].size = 100;
    } else {
      this.areas[0].size = 20;
      this.areas[1].size = 80;
    }
  }

  /**
   * Hàm select menu trên layer
   * @param args Select menu
   * @param item Đối tượng layer
   */
  selectMenu(args: any, item: any) {
    // Mở popup show thông tin layer
    if (args.item.id === "1") {
      this.openLayerDialog(item);
    }

    // Xóa layer
    if (args.item.id === "2") {
      this.gisAdvanceMapService.removeLayerById(item.guid);
      this.extendedLayers = this.extendedLayers.filter(
        (extendedLayer) => extendedLayer.id !== item.id
      );
    }
  }

  /**
   * Hàm hiển thị các lớp/nhóm lớp bản đồ lên bản đồ nền
   * @param map Bản đồ
   */
  showSelectedMap(map: any) {
    // Xoá tất cả các layer trên bản đồ
    this.gisAdvanceMapService.removeAllLayers();

    // Xóa tất cả lớp thêm mới hiển thị trên tab
    this.extendedLayers = [];

    // Hiển thị tab lớp/nhóm lớp
    this.matTabIndex = 0;

    // Gán lại view cho bản đồ
    this.gisAdvanceMapService.setView(map.center, map.zoomLevel, map.srid);
  }

  /**
   * Hàm callback khi đóng modal chọn lớp bản đồ
   */
  openLayerDialog(selectedItem?: any) {
    const dialogRef = this.dialog.open(LayerListPopupComponent, {
      data: {
        selectedItem: selectedItem,
        selectedChildIds: this.extendedLayers.map((layer) => layer.id),
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Xóa lớp
        if (result.eventName === "remove") {
          this.extendedLayers = this.extendedLayers.filter(
            (layer) => layer.id !== result.item.id
          );
          this.gisAdvanceMapService.removeLayerById(result.item.guid);
        }

        // Thêm lớp
        if (result.eventName === "add") {
          this.matTabIndex = 2;
          this.extendedLayers.push(result.item);
          this.gisAdvanceMapService.processAddNewLayer(result.item);
        }
      }
    });
  }

  /**
   * Nhãn của slide opacity
   * @param value Giá trị
   */
  formatLabel(value: number) {
    return value * 100 + "%";
  }

  /**
   *
   * @param args Giá trị của slide
   * @param extendedLayer Layer đang được thay đổi opacity
   */
  changeLayerOpacity(args: any, extendedLayer) {
    // Nếu layer đang ở trạng thái là hiển thị
    if (extendedLayer.isShow === true) {
      extendedLayer.opacity = args.value;
      this.gisAdvanceMapService.changeLayerOpacity(
        extendedLayer.guid,
        args.value
      );
    }
  }

  /**
   * Hàm xóa các layers đã được thêm vào
   */
  removeAllAddedLayers() {
    // Quay lại tab đầu tiên
    this.matTabIndex = 0;

    // Xóa tất cả layer đã được thêm vào
    this.extendedLayers.map((extendedLayer) => {
      this.gisAdvanceMapService.removeLayerById(extendedLayer.guid);
    });

    // Xóa tất cả layer hiển thị trên tab
    this.extendedLayers = [];
  }

  /**
   * Đóng tất cả layer ở phần thêm layer
   */
  closeAllPanels() {
    this.accordion.closeAll();
  }

  /**
   * Mở tất cả layer ở phần thêm layer
   */
  openAllPanels() {
    this.accordion.openAll();
  }

  /**
   *
   * @param args Trạng thái True/false
   * @param layerId Id của lớp bản đồ
   */
  extendedLayerChange(args: any, layerId: number) {
    this.extendedLayers.map((extendedLayer) => {
      // Nếu id lớp bản đồ đang đổi trạng thái
      // Bằng id lớp bản đồ trang vòng lặp
      if (extendedLayer.guid === layerId) {
        extendedLayer.isShow = args.checked;
        // Kiểm tra xem trạng thái isShow của layer
        // False => Ẩn layer
        // True => Hiện layer
        if (extendedLayer.isShow !== true) {
          this.gisAdvanceMapService.changeLayerOpacity(extendedLayer.guid, 0);
        } else {
          this.gisAdvanceMapService.changeLayerOpacity(
            extendedLayer.guid,
            extendedLayer.opacity
          );
        }
      }
    });
  }

  changeTab(args: any) {
    if (args.index === 1) {
      this.gisAdvanceMapService.addLegendOnContainer("legendView");
    }
  }
}
