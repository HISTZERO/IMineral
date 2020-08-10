import { Injectable } from '@angular/core';
declare const L: any;
import { HighchartService } from "./highchart.service";

@Injectable({
  providedIn: 'root'
})
export class SimpleMapService {
  public map;
  marker: any;
  markerGroup;

  constructor(private highchartSv: HighchartService) {
  }

  /* Hàm hiển thị marker tương ứng tất cả các điểm
  / Truyền vào: tất cả đối tượng, icon điểm
  /@by: Hùng
  */
  changeMarker(list: any[], icon: any) {
    this.markerGroup = L.layerGroup().addTo(this.map);

    for (const i in list) {
      this.marker = L.marker([list[i].toadox, list[i].toadoy], { icon: icon }).addTo(this.markerGroup);
      this.showPopup(list);
      this.chartInit(this.highchartSv.dataChartTest);
    }
  }

  /* Hàm hiển thị popup thông tin chi tiết và chart
  / Truyền vào đối tượng cần hiển thị
  /@by: Hùng
  */
  showPopup(list: any[]) {
    for (const i in list) {
      const popupContent =
        '<div class="tabs">' +
        '<div class="tab" id="thong-tin">' +
        '<div class="content">' +
        '<b>Thông tin chi tiết</b>' +
        '<p>Tên trạm : ' + list[i].tentram + '</p>' +
        '<p>Tên : ' + list[i].ten + '</p>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="bieu-do">' +
        '<div class="content">' +
        '<b>Biểu đồ</b>' +
        '<div id = "myChart" style = "width: 350px; height: 300px; margin: 0 auto"></div>' +
        '</div>' +
        '</div>' +
        '<ul class="tabs-link">' +
        '<li class="tab-link"> <a style="color : red" href=' + location.href + '#thong-tin><span>Thông tin</span></a></li>' +
        '<li class="tab-link"> <a style="color : red" href=' + location.href + '#bieu-do><span>Biểu đồ</span></a></li>' +
        '</ul>' +
        '</div>';
      this.marker.bindPopup(popupContent);
    }
  }

  /* Hàm tạo biểu đồ
  / Truyền vào: data biểu đồ
  /@by: Hùng
  */
  chartInit(dataChart) {
    this.marker.on('popupopen', function (e) {
      this.highchartSv.setSource(dataChart);
      this.highchartSv.preDataChart(dataChart, 'gw');
      this.highchartSv.setChartName('Biểu đồ nước');
      this.highchartSv.setXTittle('Thời gian đo');
      this.highchartSv.setYTittle('Giá trị đo');
      this.highchartSv.chartInit1m("myChart", 'line');
    }, this);
  }

  /* Hàm zoom tới vị trí đối tượng đã chọn
  / Truyền vào:  đối tượng
  /@by: Hùng
  */
  zoomToPoint(object: any, ten?: string) {
    this.map.setView([object.toadox, object.toadoy], 13);
    this.removeMarker();
    // this.changeMarker([object], "" );
    this.markerGroup = L.layerGroup().addTo(this.map);
    this.marker = L.marker([object.toadox, object.toadoy]).addTo(this.markerGroup);
    if(ten){
      let content = '<p>Công trình : ' + ten + '</p>';
      this.marker.bindPopup(content).openPopup();
    } else if(object.ten){
      let content = '<p>Công trình : ' + object.ten + '</p>';
      this.marker.bindPopup(content).openPopup();
    }
  }

  /* Hàm change View
  / Truyền vào tọa độ x ,y và zoom z
  /@by: Hùng
  */
  changeView(x: number, y: number, z: number) {
    this.map.setView([x, y], z);
  }

  /* Hàm change Zoom
  / Truyền vào level Zoom
  /@by: Hùng
  */
  changeZoom(z: number) {
    this.map.setZoom(z);
  }

  /* Hàm thay đổi data source với url dạng tileLayer
  / Truyền vào data source
  /@by: Hùng
  */
  changeDataSource(url: any) {
    const dataSource = L.tileLayer(url,
      {
        // subdomains:['mt0']
      });
    dataSource.addTo(this.map);
  }

  /* Hàm thay đổi data source với url dạng wms
  / Truyền vào data source , tên layer
  /@by: Hùng
  */
  changeDataWms(url: any, layer: string) {
    const dataSource = L.tileLayer.wms(url, {
      layers: layer,
      transparency: 'true',
      format: 'image/png',
      maxZoom: 21,
      opacity: 0.5
    });
    dataSource.addTo(this.map);
  }

  /* Hàm xóa tất cả các marker trên map
  /
  /@by: Hùng
  */
  removeMarker() {
    if (this.markerGroup) {
      this.map.removeLayer(this.markerGroup);
    } else {
      return;
    }

  }

  // hàm khởi tạo bản đồ, truyền vào id element
  mapInit(id: string) {

    const osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

    this.map = L.map(id,
      {
        layers: [osm],
        zoomControl: false
      }).setView([17, 105], 7);


    const baseMaps = {
      OpenStreetMap: osm
    };
    // L.control.layers(baseMaps).addTo(this.map);
    L.control.zoom({
      position: 'topleft'
    }).addTo(this.map);
    // L.easyButton({
    //   position: 'topright',
    //   states: [{
    //     icon:      'fa-refresh',
    //     title:     'Reset zoom',
    //     onClick(btn, map) {
    //       map.setView([17, 105], 7);
    //     },
    //
    //   }]
    // }).addTo(this.map);
  }
}
