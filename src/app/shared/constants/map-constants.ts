// List layer type
export const LayerTypes = [
  {
    index: "wms",
    name: "WMS",
  },
  {
    index: "geojson",
    name: "GEOJSON",
  },
  {
    index: "postgis",
    name: "POSTGIS",
  },
  {
    index: "shapefile",
    name: "SHAPE FILE",
  },
  {
    index: "csv",
    name: "CSV FILE",
  },
  {
    index: "feature",
    name: "FEATURE LAYER",
  },
];

export const DefaultCenter: string = "11744206.278690362, 1827895.5331194468";

// Callback types
export const CallbackTypes = {
  FEATURE: "feature",
};

// List status type
export const LayerStatus = [
  {
    index: 0,
    name: "Khóa",
  },
  {
    index: 1,
    name: "Sẵn sàng",
  },
];

// List status type
export const LayerGroupStatus = [
  {
    index: 0,
    name: "Khóa",
  },
  {
    index: 1,
    name: "Sẵn sàng",
  },
];

// List status type
export const LayerGroupTypes = [
  {
    index: 1,
    name: "Cho phép thay đổi lớp thành phần",
  },
  {
    index: 0,
    name: "Không cho phép thay đổi tùy chọn lớp",
  },
];

// Projection status
export const ProjectionStatus = [
  {
    index: 0,
    name: "Khóa",
  },
  {
    index: 1,
    name: "Sẵn sàng",
  },
];

// Map status
export const MapStatus = [
  {
    index: 0,
    name: "Khóa",
  },
  {
    index: 1,
    name: "Sẵn sàng",
  },
];

// Map status
export const MapCloneTypes = [
  {
    index: 0,
    name: "Chọn Lớp/Nhóm lớp",
  },
  {
    index: 1,
    name: "Copy lớp/nhóm lớp từ bản đồ khác",
  },
];

// Map unit
export const MapUnits = [
  {
    index: "m",
    name: "m",
  },
  {
    index: "lat_long",
    name: "Lat/long",
  },
];

// Category type
export const CategoryTypes = [
  {
    index: "map",
    name: "MAP",
  },
];

// Picture symbol
export const PictureSymbol = {
  type: "circle",
  url: "/assets/media/maps/map-marker.svg",
  width: "25px",
  height: "30px",
};

// Simple symbol
export const SimpleSymbol = {
  type: "simple-marker",
  color: "red",
  outline: {
    color: [128, 128, 128, 0.5],
    width: "8px",
  },
};

export const BaseMap = {
  name: "streets-vector",
  description: "World Street Map [v2]",

  // name: 'streets-navigation-vector',
  // description: 'World Navigation Map [v2]',

  // name: 'osm',
  // description: 'Open Street Map'
};

export const WidgetPositions = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left'
}

export const ToolbarActions = {
  LAYER_LIST: 'LAYER_LIST',
  MAP_LIST: 'MAP_LIST',
  ADD_LAYER: 'ADD_LAYER',
  WIDGET_LIST: 'WIDGET_LIST',
  MONITORING: 'MONITORING'
}

export const ToolbarItems = [
  {
    class: '',
    name: 'Danh sách bản đồ',
    iconClass: 'fal fa-map-marked-alt',
    action: ToolbarActions.MAP_LIST
  },
  {
    class: '',
    name: 'Lớp bản đồ',
    iconClass: 'fal fa-layer-group',
    action: ToolbarActions.LAYER_LIST
  },
  {
    class: '',
    name: 'Thêm lớp bản đồ',
    iconClass: 'fal fa-layer-plus',
    action: ToolbarActions.ADD_LAYER
  },
  {
    class: '',
    name: 'Widgets',
    group: 'ONLY_ONE_DISPLAYED',
    iconClass: 'fal fa-qrcode',
    action: ToolbarActions.WIDGET_LIST
  },
  {
    class: '',
    name: 'Thông tin quan trắc',
    group: 'ONLY_ONE_DISPLAYED',
    iconClass: 'fal fa-chart-pie-alt',
    action: ToolbarActions.MONITORING
  }
]

export const WidgetItems = {
  PAN: "PAN",
  ZOOM_IN: "ZOOM_IN",
  ZOOM_OUT: "ZOOM_OUT",
  STATISTICS: "STATISTICS",
  GET_FEATURE_INFO: "GET_FEATURE_INFO",
  ZOOM_BOX: "ZOOM_BOX",
  ADD_LAYER: "ADD_LAYER",
  SKETCH: "SKETCH",
  BASE_MAP: "BASE_MAP",
  MONITORING: "MONITORING"
};

export const Widgets = [
  {
    display: true,
    slug: WidgetItems.ZOOM_BOX,
    name: "Thu phóng",
    position: WidgetPositions.TOP_RIGHT,
    iconClass: "esri-icon-zoom-out-fixed",
  },
  {
    display: true,
    slug: WidgetItems.ADD_LAYER,
    name: "Thêm lớp",
    position: WidgetPositions.TOP_RIGHT,
    iconClass: "esri-icon-add-attachment",
  },
  {
    display: true,
    position: WidgetPositions.TOP_RIGHT,
    slug: WidgetItems.GET_FEATURE_INFO,
    name: "Thông tin lớp bản đồ",
    iconClass: "esri-icon-description",
  },
  {
    display: false,
    slug: WidgetItems.SKETCH,
    position: WidgetPositions.TOP_RIGHT,
    name: "Sketch widget",
    iconClass: "esri-icon-sketch-rectangle",
  },
  {
    display: true,
    slug: WidgetItems.STATISTICS,
    position: WidgetPositions.TOP_RIGHT,
    name: "Thống kê chức năng lớp bản đồ",
    iconClass: "esri-icon-chart",
  },
  {
    display: true,
    slug: WidgetItems.MONITORING,
    position: WidgetPositions.TOP_RIGHT,
    name: "Kết quả quan trắc",
    iconClass: "esri-icon-review",
  },
  {
    display: false,
    slug: WidgetItems.BASE_MAP,
    position: WidgetPositions.TOP_RIGHT,
    name: "Lớp bản đồ nền",
    iconClass: "esri-icon-basemap",
  },
];

export const MapAreas = {
  LAYER: 0,
  MAP: 100,
  TOOLBAR: 5,
  RIGHTCONTENT: 95,
  VERTICALWIDGET: 0,
  HORIZONTALWIGET: 0,
}

export function WMSLayerFeatureInfo(layer, view, srid, screenPoint) {
  return {
    STYLES: "",
    SERVICE: "WMS",
    VERSION: "1.1.1",
    FORMAT: "image/png",
    BGCOLOR: "0xFFFFFF",
    TRANSPARENT: "TRUE",
    WIDTH: view.width,
    HEIGHT: view.height,
    FEATURE_COUNT: 50000,
    SRS: `EPSG:${srid}`,
    REQUEST: "GetFeatureInfo",
    X: screenPoint.x.toFixed(0),
    Y: screenPoint.y.toFixed(0),
    EXCEPTIONS: "application/vnd.ogc.se_inimage",
    LAYERS: layer.sublayers.items[0].name,
    QUERY_LAYERS: layer.sublayers.items[0].name,
    INFO_FORMAT: layer.featureInfoFormat
      ? layer.featureInfoFormat
      : "application/json",
    BBOX: `${view.extent.xmin},${view.extent.ymin},${view.extent.xmax},${view.extent.ymax}`,
  };
}

export const LISTCOLORS = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

export function DefaultRenderer() {
  // Danh sách màu
  let listColors = Object.keys(LISTCOLORS);

  // Lấy random một màu trong danh sách màu
  let randomColor = listColors[Math.floor(Math.random() * listColors.length)];

  // Xóa màu đã được lấy ra random trong danh sách màu
  delete LISTCOLORS[randomColor];

  let renderer: any = {
    type: "simple",
    symbol: {
      size: 8,
      type: "simple-marker",
      color: randomColor ? randomColor : LISTCOLORS.blue,
      outline: {
        color: "white",
      },
    },
  };

  return renderer;
}

export const MettersPerPixelByZeroZoomLevel = 156412;

//Fill symbol for Polyline
//Dùng để vẽ tạm đối tượng polyline lên Graphic
export const fillSymbolPolyline = {
  type: "simple-fill",
  color: [227, 139, 79, 0.8],
  outline: {
    color: [34, 139, 34],
    width: 2
  }
};

//Fill symbol for Polygon
//Dùng để vẽ tạm đối tượng Polygon, polyline lên Graphic
export const fillSymbolPolygon = {
  type: "simple-fill",
  color: [0, 255, 255, 0],
  outline: {
    color: [0, 255, 255],
    width: 2
  }
};
