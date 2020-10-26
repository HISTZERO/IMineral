import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import "src/esri-config";
import Map from "esri/Map";
import Graphic from "esri/Graphic";
import Point from "esri/geometry/Point";
import Draw from "esri/views/draw/Draw";
import MapView from "esri/views/MapView";
import Expand from "esri/widgets/Expand";
import Legend from "esri/widgets/Legend";
import Sketch from "esri/widgets/Sketch";
import Extent from "esri/geometry/Extent";
import Circle from "esri/geometry/Circle";
import WMSLayer from "esri/layers/WMSLayer";
import CSVLayer from "esri/layers/CSVLayer";
import FeatureLayer from "esri/layers/FeatureLayer";
import GeoJSONLayer from "esri/layers/GeoJSONLayer";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import BasemapGallery from "esri/widgets/BasemapGallery";
import SpatialReference from "esri/geometry/SpatialReference";

// Custom widget
import ZoomBox from "src/app/shared/components/map/widgets/ZoomBox";
import AddLayer from "src/app/shared/components/map/widgets/AddLayer";
import Statistics from "src/app/shared/components/map/widgets/Statistics";
import FeatureInfo from "src/app/shared/components/map/widgets/FeatureInfo";
import {
  BaseMap,
  WidgetItems,
  SimpleSymbol,
  CallbackTypes,
  DefaultCenter,
  DefaultRenderer,
  WMSLayerFeatureInfo,
  MettersPerPixelByZeroZoomLevel,
} from "src/app/shared/constants/map-constants";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputMapLayerModel, OutputMapLayerModel, } from "src/app/models/admin/map/map-layer.model";


@Injectable({
  providedIn: "root",
})
export class GisAdvanceMapService extends RepositoryEloquentService {
  public map: Map;
  public draw: Draw;
  public view: MapView;
  public legend: Legend;

  // Thuộc tính view bản đồ
  private center: any;
  private zoom: number;
  private srid: number;
  private spatialReference: SpatialReference;

  // Thuộc tính của bản đồ
  private mapProperties: any;
  private defaultSymbol: any;

  // Api map url
  private baseApiUrl: string;

  // Widget đang được dùng hiện tại
  public currentWidget = WidgetItems.PAN;

  // Lưu lại fieldInfos và fieldlabels
  // Định dạng {1 (layerId): {fields: ['name', 'year',...]}}
  public listFieldsMapByLayerId: any = {};

  // Danh sách features của wms layer
  public wmsLayerFeatures: any[] = [];

  // Observable string sources
  // Observable string streams
  private componentMethodCallSource = new Subject<any>();
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor(public httpClient: HttpClient) {
    super();

    // Web map srid
    this.srid = 3857;

    // Hệ tọa độ
    this.spatialReference = new SpatialReference({ wkid: this.srid });

    // Symbol, Thuộc tính bản đồ, base url
    this.defaultSymbol = SimpleSymbol;
    this.mapProperties = { layers: [], basemap: BaseMap.name };
    this.baseApiUrl = `${environment.apiIMineral}${ServiceName.MAPLAYER}`;

    // Set service info
    this.setServiceInfo({
      apiUrl: this.baseApiUrl,
      httpClient: httpClient,
      inputModelName: new InputMapLayerModel(),
      outputModelName: new OutputMapLayerModel(),
    });

    this.drawRect = this.drawRect.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.geojsonGetFeatureInfos = this.geojsonGetFeatureInfos.bind(this);
  }

  /**
   * Hàm thêm layer vào bản đồ
   * Có thể ẩn/hiện layer trên bản đồ
   * @param layer - là layer object
   */
  processAddLayer(listLayers: any[]) {
    try {

      listLayers.map((layer) => {

        // Opacity
        let opacity: number = layer.opacity ? layer.opacity : 1;

        // Tìm lớp trên bản đồ dựa trên id của lớp đầu vào
        let mapLayer = this.getLayerByLayerId(layer.guid);

        // Tìm lớp trên bản đồ
        // False => Thêm lớp vào bản đồ
        // True => Hiển thị lớp bản đồ bằng cách thay đổi opacity
        if (!mapLayer) {
          this.layerGrouping(layer);
        } else {
          mapLayer.opacity = opacity;
        }

      });

      // Danh sách ids của lớp đầu vào
      let layerIds = listLayers.map((layer) => {
        return layer.guid;
      });

      // Các layer đang hiển thị trên bản đồ
      let currentLayers = this.view.map.layers.toArray();

      // Nếu các lớp trên bản đồ
      // không nằm trên danh sách các lớp đầu vào
      // => Ẩn lớp bằng cách thay đổi opacity = 0
      currentLayers.map(currentLayer => {
        if (layerIds.indexOf(currentLayer.id) === -1) {
          currentLayer.opacity = 0;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm thay đổi thứ tự hiển thị của lớp bản đồ
   * @param layerId Id Lớp bản đồ
   * @param index Thứ tự hiển thị
   */
  reorderLayer(layerId: string, index: number) {
    // Tìm layer trên bản đồ
    let mapLayer = this.getLayerByLayerId(layerId.toString());
    this.view.map.reorder(mapLayer, index);
  }

  /**
   * Hàm thêm mới 1 layer vào bản đồ
   * @param layer - Đối tượng layer
   */
  processAddNewLayer(layer: __esri.Layer) {
    this.layerGrouping(layer);
  }

  /**
   * Hàm xóa tất cả layer trên bản đồ
   */
  async removeAllLayers() {
    try {
      if (this.view)
        await this.view.map.layers.removeAll();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm xóa layer bằng layer id
   * @param id - Layerid
   */
  removeLayerById(id) {
    try {
      this.view.map.layers.toArray().map((mapLayer, index) => {
        if (mapLayer.id === id) {
          this.view.map.layers.removeAt(index);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm thay đổi opacity của layer bằng layer id
   * @param id - Id của layer
   */
  changeLayerOpacity(id: string, opacity: number) {
    try {
      let layer = this.view.map.findLayerById(id);
      if (layer) {
        layer.opacity = opacity;
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm sinh layer dựa vào layer type
   * @param layer - Đối tượng layer
   */
  layerGrouping(layer) {
    switch (layer.layerType) {
      case "wms":
        this.addWMSLayer(layer);
        break;
      case "geojson":
        this.addGeoJSONLayer(layer);
        break;
      case "csv":
        this.addCSVLayer(layer);
        break;
      case "feature":
        this.addFeatureLayer(layer);
        break;
    }
  }

  /**
   * Hàm lấy thông tin layers trên map
   */
  public getLayerInfos() {
    try {
      // Danh sách layers trên bản đồ
      let listMapLayers = this.view.map.layers.toArray();

      // LayerInfos
      let layerInfos: any[] = [];
      listMapLayers.map((layer) => {
        layerInfos.push({
          layer: layer,
          title: layer.title,
          caption: layer.title,
        });
      });

      return layerInfos;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm hiển thị legend trên bản đồ
   */
  addLegendOnMapView(position: string) {
    try {
      // Tạo mới legend
      var legend: any = new Legend({
        view: this.view,
        layerInfos: this.getLayerInfos(),
      });

      // Thêm legend vào view
      this.view.ui.add(legend, position);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm hiển thị legend trên bản đồ
   * @param containerId - Element id hiển thị legend
   */
  addLegendOnContainer(containerId: string) {
    // Xóa legend cũ
    if (document.getElementById(containerId)) {
      document.getElementById(containerId).textContent = "";
    }

    // Tạo mới legend
    this.legend = new Legend({
      view: this.view,
      container: containerId,
      layerInfos: this.getLayerInfos(),
    });
  }

  /**
   * Hàm khởi tạo bản đồ
   * @param elementId - là id của html element sẽ chứa bản đồ
   */
  async mapInit(elementId: string): Promise<void> {
    try {
      // Init map
      this.map = new Map(this.mapProperties);

      // Show map view
      this.initMapView(elementId);
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  /**
   * Hàm khởi tạo, hiển thị map
   * @param elementId - là id của html element sẽ chứa bản đồ
   */
  public initMapView(elementId) {
    // Khởi tạo MapView
    const mapViewProperties = {
      container: elementId,
      center: this.center,
      zoom: this.zoom,
      map: this.map,
    };

    // Init map view
    this.view = new MapView(mapViewProperties);

    // Xóa zoom
    this.view.ui.remove("zoom");

    // Init draw
    this.draw = new Draw({
      view: this.view,
    });

    // Hàm lắng nghe sự kiện click trên mapview
    this.triggerClickOnView();

    // Hàm lắng nghe sự kiện di chuyển chuột trên mapview
    this.triggerPointerMoveOnView();
  }

  // Sketch widget
  public sketch: Sketch;

  /**
   * Hàm toggle sketch widget
   * @param status 0: Ẩn, 1: hiển thị
   * @param position Vị trí hiển thị của widget
   */
  toggleSketchWidget(widget: any) {

    // Thay đổi trạng thái hiển thị
    widget.display != widget.display;

    // Kiểm tra trạng thái
    // 1 => Hiển thị widget
    // 2 => Ẩn widget
    if (widget.display) {

      if (this.sketch) return;

      // Tạo mới graphic layer và thêm vào map
      let graphicLayer = new GraphicsLayer();
      this.view.map.add(graphicLayer);

      // Tạo mới sketch widget
      this.sketch = new Sketch({
        view: this.view,
        layer: graphicLayer,
        creationMode: "update",
      });

      // Thêm sketch widget vào view
      this.view.ui.add(this.sketch, widget.position);
    } else if (this.sketch) {
      this.sketch.destroy();
      delete this.sketch;
    }
  }

  // Statistics widget
  public statistics: Statistics;

  /**
   * Hàm toggle sketch widget
   * @param widget Đối tượng widget
   */
  toggleStatisticsWidget(widget: any) {

    // Kiểm tra trạng thái
    // 1 => Hiển thị widget
    // 2 => Ẩn widget
    if (widget.display) {

      if (this.statistics) return;

      this.statistics = new Statistics({
        service: this,
        widget: widget,
        iconClass: widget.iconClass,
      });

      // Thêm statistics widget vào view
      this.view.ui.add(this.statistics, widget.position);

    } else if (this.statistics) {
      this.statistics.destroy();
      delete this.statistics;
    }
  }

  // // Kết quả quan trắc widget
  // public monitoringWidget: Monitoring;

  // /**
  //  * Widget thống kê
  //  * @param widget Đối tượng widget
  //  */
  // toggleMonitoringWidget(widget: any) {

  //   // Kiểm tra trạng thái
  //   // 1 => Hiển thị widget
  //   // 2 => Ẩn widget
  //   if (widget.display) {

  //     if (this.monitoringWidget) return;

  //     this.monitoringWidget = new Monitoring({
  //       service: this,
  //       widget: widget,
  //       iconClass: widget.iconClass,
  //     });

  //     // Thêm Kết quả quan trắc widget
  //     this.view.ui.add(this.monitoringWidget, widget.position);
  //   } else if (this.monitoringWidget) {
  //     this.monitoringWidget.destroy();
  //     delete this.monitoringWidget;
  //   }
  // }

  // monitoringWidget widget
  public bgExpand: Expand;

  /**
   * Hàm toggle bản đồ cơ sở
   * @param widget Đối tượng widget
   */
  toggleBaseMapWidget(widget: any) {

    // Kiểm tra trạng thái
    // 1 => Hiển thị widget
    // 2 => Ẩn widget
    if (widget.display) {

      if (this.bgExpand) return;

      var basemapGallery = new BasemapGallery({
        view: this.view,
      });

      this.bgExpand = new Expand({
        view: this.view,
        content: basemapGallery,
      });

      this.view.ui.add(this.bgExpand, widget.position);
    } else if (this.bgExpand) {
      this.bgExpand.destroy();
      delete this.bgExpand;
    }
  }

  // Zoombox widget
  public zoombox: ZoomBox;

  /**
   * Hiển thị zoombox widget
   * @param widget Đối tượng widget
   */
  toggleZoomBoxWidget(widget: any) {

    // Kiểm tra trạng thái
    // 1 => Hiển thị widget
    // 2 => Ẩn widget
    if (widget.display) {

      if (this.zoombox) return;

      this.zoombox = new ZoomBox({
        service: this,
        iconClass: widget.iconClass,
      });

      // Thêm zoombox widget vào view
      this.view.ui.add(this.zoombox, widget.position);

    } else if (this.zoombox) {
      this.zoombox.destroy();
      delete this.zoombox;
    }
  }

  // Feature info widget
  public featureInfo: FeatureInfo;

  /**
   * Hiển thị zoombox widget
   * @param widget Đối tượng widget
   */
  toggleFeatureInfoWidget(widget: any) {

    // Kiểm tra trạng thái
    // 1 => Hiển thị widget
    // 2 => Ẩn widget
    if (widget.display) {

      if (this.featureInfo) return;

      this.featureInfo = new FeatureInfo({
        service: this,
        iconClass: widget.iconClass,
      });

      // Thêm featureInfo widget vào view
      this.view.ui.add(this.featureInfo, widget.position);

    } else if (this.featureInfo) {
      this.featureInfo.destroy();
      delete this.featureInfo;
    }
  }

  // Thêm mớp lớp widget
  public addLayerWidget: AddLayer;

  /**
   * Hiển thị thêm mới lớp widget
   * @param widget Đối tượng widget
   */
  toggleAddLayerWidget(widget: any) {

    // Kiểm tra trạng thái
    // 1 => Hiển thị widget
    // 2 => Ẩn widget
    if (widget.display) {

      if (this.addLayerWidget) return;

      this.addLayerWidget = new AddLayer({
        service: this,
        widget: widget,
        iconClass: widget.iconClass,
      });

      // Thêm thêm lớp widget vào view
      this.view.ui.add(this.addLayerWidget, widget.position);

    } else if (this.addLayerWidget) {
      this.addLayerWidget.destroy();
      delete this.addLayerWidget;
    }
  }

  // Biến lưu sự kiện kéo thả và sự kiện click chuột
  evtViewDragHandler: any;
  evtViewKeyDownHandler: any;

  /**
   * Bật chức năng cho phép kéo bản đồ
   */
  enableViewPanning() {
    this.draw.destroy();
    if (this.evtViewDragHandler) {
      this.evtViewDragHandler.remove();
      this.evtViewDragHandler = null;
    }
    if (this.evtViewKeyDownHandler) {
      this.evtViewKeyDownHandler.remove();
      this.evtViewKeyDownHandler = null;
    }
  }

  /**
   * Tắt chức năng kéo bản đồ
   */
  disableViewPanning() {
    if (this.evtViewDragHandler) {
      this.evtViewDragHandler.remove();
      this.evtViewDragHandler = null;
    }
    if (this.evtViewKeyDownHandler) {
      this.evtViewKeyDownHandler.remove();
      this.evtViewKeyDownHandler = null;
    }
    this.evtViewDragHandler = this.view.on("drag", function (event) {
      event.stopPropagation();
    });

    this.evtViewKeyDownHandler = this.view.on("key-down", function (event) {
      var keyPressed = event.key;
      if (keyPressed.slice(0, 5) === "Arrow") {
        event.stopPropagation();
      }
    });
  }

  /**
   * Lấy giá trị mở rộng dựa vào điểm cao nhất
   * @param vertices Điểm cao nhất
   */
  getExtentfromVertices(vertices) {
    var sx = vertices[0][0],
      sy = vertices[0][1];
    var ex = vertices[1][0],
      ey = vertices[1][1];
    let rect: any = {
      x: Math.min(sx, ex),
      y: Math.max(sy, ey),
      width: Math.abs(sx - ex),
      height: Math.abs(sy - ey),
      spatialReference: this.view.spatialReference,
    };
    if (rect.width !== 0 || rect.height !== 0) {
      return new Extent({
        xmin: parseFloat(rect.x),
        ymin: parseFloat(rect.y) - parseFloat(rect.height),
        xmax: parseFloat(rect.x) + parseFloat(rect.width),
        ymax: parseFloat(rect.y),
        spatialReference: rect.spatialReference,
      });
    } else {
      return null;
    }
  }

  /**
   * Hàm vẽ hình chữ nhập khi zoom
   * @param event Sự kiện click chuột
   */
  drawRect(event) {
    // Lấy điểm cao nhất
    var vertices = event.vertices;

    // Xóa tất cả graphic
    this.view.graphics.removeAll();
    if (vertices.length < 2) {
      return;
    }

    // Tạo mới symbol
    let symbol = {
      type: "simple-fill",
      color: [0, 0, 0, 0.3],
      style: "solid",
      outline: {
        color: [255, 0, 0],
        width: 1,
      },
    };

    // Tạo mới extend
    var extent = this.getExtentfromVertices(vertices);

    // Tạo mới graphic với symbol và extend
    var graphic = new Graphic({
      geometry: extent,
      symbol: symbol,
    });

    // Thêm graphic vào view
    this.view.graphics.add(graphic);
  }

  /**
   * Hàm bắt đầu chức năng zoom out
   */
  public startZoomOut() {
    // Tắt chức năng view panning
    this.disableViewPanning();

    // Xóa tất cả các graphic
    this.view.graphics.removeAll();

    // Tạo action dạng rectangle
    var action = this.draw.create("rectangle");

    // Vẽ hình rectangle
    action.on("vertex-add", this.drawRect);
    action.on("draw-complete", this.zoomOut);
    action.on("cursor-update", this.drawRect);
  }

  /**
   * Hàm zoom out bản đồ
   * @param evt Sự kiện click chuột
   */
  zoomOut(evt) {
    // Lấy điểm cao nhất
    var vertices = evt.vertices;

    // Reset draw và xóa tất cả graphics
    this.draw.reset();
    this.view.graphics.removeAll();

    // Tạo mới sự kiện
    var action = this.draw.create("rectangle");

    // Hàm lắng nghe sự kiện draw
    action.on("vertex-add", this.drawRect);
    action.on("draw-complete", this.zoomOut);
    action.on("cursor-update", this.drawRect);

    // Zoom out
    if (evt.vertices.length === 1) {
      this.view.goTo({ scale: this.view.scale * 2 });
      return;
    }

    // Lấy extend từ vertices
    var sx = vertices[0][0],
      sy = vertices[0][1];
    var ex = vertices[1][0],
      ey = vertices[1][1];
    var rect = {
      x: Math.min(sx, ex),
      y: Math.max(sy, ey),
      width: Math.abs(sx - ex),
      height: Math.abs(sy - ey),
      spatialReference: this.view.spatialReference,
    };

    // Xử lý thu nhỏ
    if (rect.width !== 0 || rect.height !== 0) {
      var scrPnt1 = this.view.toScreen(
        new Point({
          x: rect.x,
          y: rect.y,
          spatialReference: rect.spatialReference,
        })
      );

      var scrPnt2 = this.view.toScreen(
        new Point({
          x: rect.x + rect.width,
          y: rect.y,
          spatialReference: rect.spatialReference,
        })
      );

      var mWidth = this.view.extent.width;
      var delta =
        ((mWidth * this.view.width) / Math.abs(scrPnt2.x - scrPnt1.x) -
          mWidth) /
        2;
      var vExtent = this.view.extent;
      this.view.goTo(
        new Extent({
          xmin: vExtent.xmin - delta,
          ymin: vExtent.ymin - delta,
          xmax: vExtent.xmax + delta,
          ymax: vExtent.ymax + delta,
          spatialReference: vExtent.spatialReference,
        })
      );
    }
  }

  /**
   * Hàm bắt đầu chức năng zoom im
   */
  public startZoomIn() {

    // Tắt chức năng view panning
    this.disableViewPanning();

    // Xóa tất cả các graphic
    this.view.graphics.removeAll();

    // Tạo action dạng rectangle
    var action = this.draw.create("rectangle");

    // Vẽ hình rectangle
    action.on("vertex-add", this.drawRect);
    action.on("draw-complete", this.zoomIn);
    action.on("cursor-update", this.drawRect);
  }

  /**
   * Hàm zoom in bản đồ
   * @param evt Sự kiện click chuột
   */
  zoomIn(evt) {
    // Reset draw và xóa graphic
    this.draw.reset();
    this.view.graphics.removeAll();

    // Tạo mới action
    var action = this.draw.create("rectangle");

    // Vẽ hình rectangle
    action.on("vertex-add", this.drawRect);
    action.on("draw-complete", this.zoomIn);
    action.on("cursor-update", this.drawRect);

    // Zoom in
    if (evt.vertices.length === 1) {
      this.view.goTo({ scale: this.view.scale * 0.5 });
      return;
    }

    // Đến extend
    var extent = this.getExtentfromVertices(evt.vertices);
    if (extent.width !== 0 || extent.height !== 0) {
      this.view.goTo(extent);
    }
  }

  /**
   * Lắng nghe sự kiện di chuột trên bản đồ
   */
  triggerPointerMoveOnView() {
    try {
      this.view.on("pointer-move", function (event) {
        // console.log(event, 'pointer-move');
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Sự kiện lắng nghe click trên map view
   */
  async triggerClickOnView() {

    try {

      // Lắng nghe sự kiến click trên bản đồ
      await this.view.on("click", async (evt: any) => {

        // Kiểm tra điều kiện để get features info
        if ([
          WidgetItems.GET_FEATURE_INFO,
          WidgetItems.STATISTICS
        ].indexOf(this.currentWidget) !== -1) {

          const promises = await this.view.map.layers
            .toArray()
            .map(async layer => {
              if (layer.opacity > 0) {
                switch (layer.type) {
                  case "wms":
                    return await this.wmsLayerGetFeatureInfos(layer, evt);
                  case "csv":
                  case "geojson":
                    return await this.geojsonGetFeatureInfos(layer, evt);
                }
              }
            });

          // Lấy danh sách features
          const results: any = await Promise.all(promises);

          // Tạo mảng features
          let features: any = [];
          await results.map((result) => {
            if (result !== undefined) features.push(...result);
          });

          // Gọi hàm hiển thị popup feature info
          if (this.currentWidget === WidgetItems.GET_FEATURE_INFO) {
            this.showPopupFeaturesInfo(features, evt);
          }

          // Gọi hàm hiển thị thống kê
          if (this.currentWidget === WidgetItems.STATISTICS) {
            this.showSatisticsFeaturesInfo(features);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm hiển thị thống kê các chức năng của lớp bản đồ
   * @param features Danh sách chức năng
   */
  showSatisticsFeaturesInfo(features) {

    // Lấy danh sách các features thuộc lớp wms
    this.wmsLayerFeatures = features.filter((feature) => {
      return feature.layerType === "wms";
    });

    // Nếu không có feature nào thuộc lớp wms thì dừng lại
    if (!this.wmsLayerFeatures) return;

    // Hiển thị thống kê của lớp bản đồ
    return this.componentMethodCallSource.next({
      type: CallbackTypes.FEATURE,
    });
  }

  /**
   * Hàm hiện thị popup features info
   * @param features Danh sách chức năng của các lớp bản đồ
   * @param evt Sự kiện click chuột
   */
  async showPopupFeaturesInfo(features, evt) {

    if (features.length > 0) {

      let graphics: any[] = [];

      // Lặp qua từng feature
      // Tạo mới graphic => gán vào mảng graphics
      features.map((feature) => {
        let fields = Object.keys(feature.attributes);
        graphics.push(
          this.createNewGraphic(fields, feature.layerId, feature.layerType, feature)
        );
      });

      // Nếu mảng graphics rỗng thì không hiện popup
      if (graphics.length === 0) return;

      // Tạo mới một geometry point
      let mapPoint = new Point({
        x: evt.mapPoint.x,
        y: evt.mapPoint.y,
        spatialReference: this.spatialReference,
      });

      // Hiển thị popup
      setTimeout(() => {
        this.view.popup.open({
          features: graphics,
          location: mapPoint,
        });
      }, 200);
    }
  }

  /**
   * Hàm lấy thông tin của lớp bản đồ dạng wms
   * @param layer Lớp bản đồ
   * @param screenPoint Điểm click
   */
  async wmsLayerGetFeatureInfos(layer, evt) {

    let features = [];

    try {

      // Thông tin truy vấn get featureinfo
      this.setServiceInfo({ apiUrl: layer.url });
      let data = WMSLayerFeatureInfo(
        layer,
        this.view,
        this.srid,
        evt.screenPoint
      );

      // Gọi api get featureinfo
      let response: any = await this.getFetchAll(data);
      features = response.features ? response.features : [];

      // Fields and labels config
      let fieldsAndLabels = this.listFieldsMapByLayerId[layer.id] ?
        this.listFieldsMapByLayerId[layer.id] : [];

      // Định dạng features trả về
      features.map((feature) => {
        feature.layerId = layer.id;
        feature.layerType = layer.type;
        feature.attributes = feature.properties;
        feature.fieldsAndLabels = fieldsAndLabels;
        delete feature.properties;
      });

    } catch (error) { }

    return await features;
  }

  /**
   * Hàm lấy thông tin của lớp bản đồ dạng geojson và csv (file)
   * @param layer Lớp bản đồ
   * @param evt Sự kiện click vào bản đồ
   */
  async geojsonGetFeatureInfos(layer, evt) {
    // Tạo ra một circle
    // Center là điểm đang click trên bản đồ
    // Radius được tính toán dựa trên view zoom và một thuật toán scale
    let pixelByScaleLevel =
      MettersPerPixelByZeroZoomLevel / Math.pow(2, this.view.zoom);
    let circle = new Circle({
      center: evt.mapPoint,
      radius: this.view.zoom * pixelByScaleLevel,
    });

    // Chứa features
    let features: any[];

    // Lấy features dựa trên extent của circle
    layer.query.geometry = circle.extent;
    await layer.queryFeatures(layer.query).then(async (response) => {
      // Định dạng dữ liệu trả về
      features = response.features ? response.features : [];
      features.map((feature) => {
        feature.layerId = layer.id;
        feature.layerType = layer.type;
      });
    });

    return await features;
  }

  /**
   * Tạo mới một graphic
   * @param fields Danh sách các fields của feature
   * @param layer Lớp bản đồ
   * @param feature Chức năng của lớp bản đồ
   */
  createNewGraphic(fields, layerId, layerTitle, feature) {

    let layerFields = this.configFieldsByLayerFields(fields, layerId);

    // Nội dung
    var textContent = `<table class="esri-widget__table"><tbody>`;
    layerFields.map((field) => {
      textContent += `<tr>
          <th class="esri-feature__field-header">${field.label}</th>
          <td class="esri-feature__field-data">${feature.attributes[field.name]
        }</td>
      </tr>`;
    });
    textContent += `</tbody></table>`;

    // Tạo mới graphic
    let graphic = new Graphic({
      popupTemplate: {
        outFields: ["*"],
        title: layerTitle,
        content: [{ type: "text", text: textContent }],
      },
    });

    return graphic;
  }

  /**
   * Hàm lấy
   * @param layerId Layer id
   */
  getLayerByLayerId(layerId: string) {
    return this.view.map.findLayerById(layerId);
  }

  /**
   * Lấy giá trị của features bằng các trường đã được
   * cấu hình trong lớp bản đồ
   * @param layer Lớp bản đồ
   * @param fields Danh sách các trường chức năng lớp bản đồ
   */
  configFieldsByLayerFields(fields, layerId) {

    let resultFields = [];

    if (this.listFieldsMapByLayerId[layerId]) {

      // Cắt chuỗi
      let splitFieldsInfo: string[] = this.listFieldsMapByLayerId[layerId]
        .fields;
      let splitFieldsDisplay: string[] = this.listFieldsMapByLayerId[layerId]
        .labels;

      splitFieldsInfo.map((field, idx) => {
        if (fields.filter((f) => f === field)) {
          resultFields.push({
            name: field,
            label: splitFieldsDisplay[idx] ? splitFieldsDisplay[idx] : field,
          });
        }
      });
    } else {
      fields.map((field) => {
        resultFields.push({
          name: field,
          label: field,
        });
      });
    }

    return resultFields;
  }

  /**
   * Hàm di chuyển widget tới vị trí mong muốn
   * @param name - Tên widget
   * @param position - Vị trí
   */
  moveWidget(name: string, position: string) {
    try {
      this.view.ui.move(name, position);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm di chuyển widget tới vị trí mong muốn
   * @param name - Custom widget
   * @param position - Vị trí
   */
  addCustomWidget(name: any, position: string) {
    try {
      this.view.ui.add(name, position);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm đặt basemap cho bản đồ sẽ hiển thị
   * @param basemap - set the basemap
   */
  public setBaseMap(basemap: string) {
    this.mapProperties.basemap = basemap;
  }

  /**
   * Hàm đặt mức (level) zoom của bản đồ
   * @param zoomLevel - số nguyên dùng để set level zoom của bản đồ
   */
  public setZoom(zoomLevel: number) {
    this.zoom = zoomLevel;
  }

  /**
   * Hàm thay đổi center bản đồ
   * @param X - Tọa độ X
   * @param Y - Tọa độ Y
   */
  public setCenter(X: number, Y: number) {
    this.center = new Point({
      x: X,
      y: Y,
      spatialReference: this.spatialReference,
    });
  }

  /**
   * Hàm hiển thị các điểm và icon tương ứng truyền vào lên bản đồ
   * @param markerList - mảng chứa đối tượng các điểm sẽ được đánh dấu trên bản đồ
   * @param icon - Là đối tượng marker mà ArcGIS API hỗ trợ
   */
  public setMarkers(markerList: any[], symbol: any = this.defaultSymbol) {
    try {
      // Each marker
      markerList.map((marker) => {
        // First create a point geometry
        let point: Point = new Point({
          x: marker.X,
          y: marker.Y,
          spatialReference: this.spatialReference,
        });

        // Create a graphic and add the geometry and symbol to it
        const pointGraphic = new Graphic({
          geometry: point,
          symbol: symbol,
        });

        // Show point graphic
        this.view.graphics.add(pointGraphic);
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hiển thị popup tại một vị trí trên bản đồ
   * @param pointList - Danh sách đối tượng các điểm sẽ được đánh dấu trên bản đồ
   * @param title - Tiêu đề popup
   */
  setPopups(pointList, title) {
    try {
      // Each point
      pointList.map((point) => {
        // First create a point geometry
        let mapPoint = new Point({
          x: point.X,
          y: point.Y,
          spatialReference: this.spatialReference,
        });

        // Set popup
        const popup = {
          title: title,
          location: mapPoint,
        };

        // Show popup and set content
        this.view.popup.open(popup);
        this.view.popup.content = point.pointName;
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm thay đổi base map
   * @param name - tên base map
   */
  public setBasemap(name: any) {
    try {
      this.view.map.basemap = name;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm xóa hết các marker có trên bản đồ
   */
  public removeMarkers() {
    try {
      this.view.graphics.removeAll();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Chuyển tọa độ từ lat long sang x,y
   * @param toado Tọa độ X,Y
   */
  degrees2meters(toado) {
    let x: any = toado.long * 20037508.34 / 180;
    let y: any = Math.log(Math.tan((90 + toado.lat) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    return {
      lat: parseInt(x),
      long: parseInt(y),
    }
  }

  /**
   * Hàm thay đổi view bản đồ
   * @param X - Tọa độ X
   * @param Y - Tọa độ Y
   * @param zLevel - zoom Level
   */
  public setView(center: string, zLevel: number = 4, kieuToaDo: string = 'xy', srid: number = this.srid) {
    try {

      // Gán lại hệ tọa độ
      if (srid) this.spatialReference = new SpatialReference({ wkid: srid });

      // Tọa độ
      let splitCenter = center.split(",");
      let toado: { lat: number, long: number } = {
        lat: parseInt(splitCenter[0]),
        long: parseInt(splitCenter[1]),
      }

      // Convert tọa độ latlng to xy
      if (kieuToaDo === 'latlng') {
        toado = this.degrees2meters(toado);
      }

      // Gán điểm trung tâm bản đồ
      this.view.center = new Point({
        x: toado.lat,
        y: toado.long,
        spatialReference: this.spatialReference,
      });

      // Set zoom level
      this.view.zoom = zLevel;

    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Lấy danh sách các fields để hiển thị
   * @param layer Lớp bản đồ
   */
  mapFieldsByLayerId(layer) {

    let splitFieldsInfo: string[] = [];
    let splitFieldsDisplay: string[] = [];

    // Lấy ds fields từ bản đồ
    if (
      layer.fieldsInfo !== undefined &&
      layer.fieldsInfo !== null
    ) {
      splitFieldsInfo = layer.fieldsInfo.trim().split("|");
    }

    // Lấy ds nhãn từ bản đồ
    if (
      layer.fieldsDisplay !== undefined &&
      layer.fieldsDisplay !== null
    ) {
      splitFieldsDisplay = layer.fieldsDisplay.trim().split("|");
    }

    // Lấy ds fields từ lớp nếu không lấy được ds fields từ bản đồ
    if (
      !splitFieldsInfo.length &&
      layer.fieldsInfo !== undefined &&
      layer.fieldsInfo !== null
    ) {
      splitFieldsInfo = layer.fieldsInfo.trim().split("|");
    }

    // Lấy ds nhãn từ lớp nếu không lấy được ds nhãn từ bản đồ
    if (
      !splitFieldsDisplay.length &&
      layer.fieldsDisplay !== undefined &&
      layer.fieldsDisplay !== null
    ) {
      splitFieldsDisplay = layer.fieldsDisplay.trim().split("|");
    }

    if (
      splitFieldsInfo.length &&
      splitFieldsDisplay.length &&
      splitFieldsInfo[0] !== "" &&
      splitFieldsDisplay[0] !== ""
    ) {
      this.listFieldsMapByLayerId[layer.guid] = {
        fields: splitFieldsInfo,
        labels: splitFieldsDisplay,
      };
    }
  }

  /**
   * Hàm add lên bản đồ một lớp WMS vừa được truyền vào
   * @param obj - WMS layer object
   */
  async addWMSLayer(obj: any) {
    try {

      // Lưu lại fields cấu hình bởi người dùng
      await this.mapFieldsByLayerId(obj);

      // Khởi tạo lớp wms
      const wmsLayer = new WMSLayer({
        id: obj.guid,
        url: obj.wmsUrl,
        title: obj.layerTitle,
        featureInfoFormat: obj.fieldsInfoFormat,
        opacity: obj.opacity ? obj.opacity : 0,
        sublayers: [
          {
            name: obj.wmsLayers,
            legendUrl: `${obj.wmsUrl}?REQUEST=GetLegendGraphic
                    &VERSION=1.1.0&FORMAT=image/png
                    &WIDTH=25&HEIGHT=25
                    &LAYER=${obj.wmsLayers}`,
          },
        ],
      });

      this.view.map.add(wmsLayer);

    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm add lên bản đồ một lớp GeoJSON vừa được truyền vào
   * @param obj - có thể là một GeoJSON object hoặc một string URL (nguồn của file GeoJSON)
   * @param isURL - xác định xem obj trên có phải là URL ko, nếu là URL phải load GeoJSON object từ URL đó trước
   */
  async addGeoJSONLayer(obj: any, isURL: boolean = false) {
    try {
      // Init variable
      let item: any;
      let geojsonLayer: any;

      // Input is string
      if (isURL === true) {
        item = {
          outFields: ["*"],
          url: obj.toString(),
        };
      } else {
        // Lưu lại fields cấu hình bởi người dùng
        await this.mapFieldsByLayerId(obj);
        item = {
          id: obj.guid,
          outFields: ["*"],
          url: obj.sourceUrl,
          copyright: obj.copyright,
          renderer: DefaultRenderer(),
          title: obj.layerTitle,
          opacity: obj.opacity,
        };
      }

      // Tạo mới geojsonlayer
      geojsonLayer = new GeoJSONLayer(item as GeoJSONLayer);

      // Tạo mới một truy vấn cho lớp
      let query = geojsonLayer.createQuery();
      geojsonLayer.query = query;

      // Thêm lớp vào bản đồ
      this.view.map.add(geojsonLayer);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm add lên bản đồ một lớp CSV vừa được truyền vào
   * @param obj - Layer object
   */
  async addCSVLayer(obj: any) {
    try {
      // Lưu lại fields cấu hình bởi người dùng
      await this.mapFieldsByLayerId(obj);

      // Tạo mới csv
      const csvLayer: any = new CSVLayer({
        id: obj.guid,
        outFields: ["*"],
        url: obj.sourceUrl,
        renderer: DefaultRenderer(),
        copyright: obj.copyright,
        opacity: obj.opacity,
        title: obj.layerTitle,
      });

      // Tạo mới một truy vấn cho lớp
      let query = csvLayer.createQuery();
      csvLayer.query = query;

      // Thêm lớp vào bản đồ
      this.view.map.add(csvLayer);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Hàm add lên bản đồ một lớp Feature vừa được truyền vào
   * @param obj - Layer object
   */
  async addFeatureLayer(obj: any) {
    try {
      // Lưu lại fields cấu hình bởi người dùng
      await this.mapFieldsByLayerId(obj);

      // Typical usage
      // Create featurelayer from feature service
      const featureLayer = new FeatureLayer({
        url: obj.featureUrl
      });

      // Thêm lớp vào bản đồ
      this.view.map.add(featureLayer);
    } catch (error) {
      console.log(error);
    }
  }
}
