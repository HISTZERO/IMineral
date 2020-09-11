import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import * as Map from "esri/Map";
import * as Graphic from "esri/Graphic";
import * as Point from "esri/geometry/Point";
import * as MapView from "esri/views/MapView";
import * as WMSLayer from "esri/layers/WMSLayer";
import * as GeoJSONLayer from "esri/layers/GeoJSONLayer";
import * as SpatialReference from "esri/geometry/SpatialReference";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { SimpleSymbol, BaseMap } from "src/app/shared/constants/map-constants";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputMapLayerModel, OutputMapLayerModel } from "src/app/models/admin/map/map-layer.model";

@Injectable({
  providedIn: "root"
})
export class GisBaseMapService extends RepositoryEloquentService {

  public map: Map;
  public view: MapView;

  // Thuộc tính view bản đồ
  public center: any;
  public zoom: number;
  public srid: number;
  public spatialReference: SpatialReference;

  // Thuộc tính của bản đồ
  public mapProperties: any;
  public defaultSymbol: any;

  // Api map url
  public baseApiUrl: string;

  constructor(public httpClient: HttpClient) {
    super();

    // Web map srid
    this.srid = 3857;

    // Symbol, Thuộc tính bản đồ, base url
    this.defaultSymbol = SimpleSymbol;
    this.mapProperties = { layers: [], basemap: BaseMap.name };
    this.baseApiUrl = `${environment.apiIMineral}${ServiceName.MAPLAYER}`;

    // Thuộc tính view
    this.spatialReference = new SpatialReference({ wkid: this.srid });

    // Set service info
    this.setServiceInfo({
      httpClient,
      apiUrl: this.baseApiUrl,
      inputModelName: new InputMapLayerModel(),
      outputModelName: new OutputMapLayerModel()
    });
  }

  /**
   * Hàm lấy tất cả layers của bản đồ
   * @param mapId - là id của bản đồ
   */
  async getMapLayers(mapId) {

    // Đầu api get layers
    let apiStr = 'get-all-mapLayer-layer-by-mapId';

    // Set api url
    let apiUrl: string = `${this.baseApiUrl}/${apiStr}/${mapId}`;
    this.setServiceInfo({ apiUrl });

    // Fetch all data
    let response: any = await this.getFetchAll();
    return response;
  }

  /**
   * Hàm thêm layer vào bản đồ
   * @param layer - là layer object
   */
  async processAddLayer(layer) {
    switch (layer.layerType) {
      case "wms":
        await this.addWMSLayer(layer);
        break;
    }
  }

  /**
   * Hàm khởi tạo bản đồ
   * @param elementId - là id của html element sẽ chứa bản đồ
   */
  async mapInit(elementId: string, mapId?: number,): Promise<void> {
    try {

      // Init map
      this.map = new Map(this.mapProperties);

      if (mapId) {
        // Get map layers
        let mapLayers = await this.getMapLayers(mapId);

        // Each map layer
        // Call function add layer to map
        mapLayers.map(layer => {
          this.processAddLayer(layer);
        });
      }

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
      map: this.map
    };

    // Init map view
    this.view = new MapView(mapViewProperties);
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
      x: X, y: Y, spatialReference: this.spatialReference
    });
  }

  /**
   * Hàm hiển thị các điểm và icon tương ứng truyền vào lên bản đồ
   * @param markerList - mảng chứa đối tượng các điểm sẽ được đánh dấu trên bản đồ
   * @param icon - Là đối tượng marker mà ArcGIS API hỗ trợ
   */
  public setMarkers(markerList: any[], symbol: any = this.defaultSymbol) {
    // Each marker
    markerList.map(marker => {
      // First create a point geometry
      let point: Point = new Point({
        x: marker.X, y: marker.Y, spatialReference: this.spatialReference
      });

      // Create a graphic and add the geometry and symbol to it
      const pointGraphic = new Graphic({
        geometry: point,
        symbol: symbol
      });

      // Show point graphic
      this.view.graphics.add(pointGraphic);

    });
  }

  /**
   * Hiển thị popup tại một vị trí trên bản đồ
   * @param pointList - Danh sách đối tượng các điểm sẽ được đánh dấu trên bản đồ
   * @param title - Tiêu đề popup
   */
  setPopups(pointList, title) {
    // Each point
    pointList.map(point => {

      // First create a point geometry
      let mapPoint = new Point({
        x: point.X, y: point.Y, spatialReference: this.spatialReference
      });

      // Set popup
      const popup = {
        title: title,
        location: mapPoint
      };

      // Show popup and set content
      this.view.popup.open(popup);
      this.view.popup.content = point.pointName;
    });
  }

  /**
   * Hàm thay đổi base map
   * @param name - tên base map
   */
  public setBasemap(name: any) {
    this.view.map.basemap = name;
  }

  /**
   * Hàm xóa hết các marker có trên bản đồ
   */
  public removeMarkers() {
    this.view.graphics.removeAll();
  }

  /**
   * Hàm thay đổi view bản đồ
   * @param X - Tọa độ X
   * @param Y - Tọa độ Y
   * @param zLevel - zoom Level
   */
  public setView(X: number, Y: number, zLevel?: number) {
    try {
      this.view.center = new Point({
        x: X, y: Y, spatialReference: this.spatialReference
      });
      this.view.zoom = zLevel;
    } catch (e) {
      console.log('Setview Error: ', e.message);
    }
  }

  /**
   * Hàm add lên bản đồ một lớp WMS vừa được truyền vào
   * @param obj - WMS layer object
   */
  addWMSLayer(obj: any) {

    let layer: any = {
      url: obj.wmsUrl,
      opacity: obj.mapLayer_Opacity,
      sublayers: [{ name: obj.wmsLayers }]
    };

    // Init wms layer
    const wmsLayer = new WMSLayer(layer);
    this.map.add(wmsLayer);
  }

  /**
   * Hàm add lên bản đồ một lớp GeoJSON vừa được truyền vào
   * @param obj - có thể là một GeoJSON object hoặc một string URL (nguồn của file GeoJSON)
   * @param isURL - xác định xem obj trên có phải là URL ko, nếu là URL phải load GeoJSON object từ URL đó trước
   */
  addGeoJSONLayer(obj: any, isURL: boolean) {
    let geojsonLayer: any;
    // Geo json input là url
    if (isURL === true) {
      geojsonLayer = new GeoJSONLayer({
        url: obj.toString()
      });
    }
    this.map.add(geojsonLayer);
  }
}
