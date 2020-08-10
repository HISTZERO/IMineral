import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as moment from 'moment-mini';

declare var require: any;


@Injectable({
  providedIn: 'root'
})
export class HighchartService {
  // data test
  dataChartTest: any = {
    "monthInput": {
      "month": 7,
      "items": [
        {
          "fullTime": "2019-07-01T00:44:00",
          "giatrido": -9.664999000000002
        },
        {
          "fullTime": "2019-07-01T01:44:00",
          "giatrido": -9.653599
        },
        {
          "fullTime": "2019-07-01T02:44:00",
          "giatrido": -9.643298999999999
        }
      ]
    },
    "monthBefore": {
      "month": 6,
      "items": [
        {
          "fullTime": "2019-06-01T00:44:00",
          "giatrido": -9.697499
        },
        {
          "fullTime": "2019-06-01T01:44:00",
          "giatrido": -9.689399000000002
        },
        {
          "fullTime": "2019-06-01T02:44:00",
          "giatrido": -9.672499000000002
        },
        {
          "fullTime": "2019-06-01T03:44:00",
          "giatrido": -9.657699000000001
        },
        {
          "fullTime": "2019-06-01T04:44:00",
          "giatrido": -9.640599000000002
        }
      ]
    },
    "monthAfter": {
      "month": 8,
      "items": [
        {
          "fullTime": "2019-08-01T02:44:00",
          "giatrido": -9.6512
        },
        {
          "fullTime": "2019-08-01T03:44:00",
          "giatrido": -9.641100000000002
        },
        {
          "fullTime": "2019-08-01T04:44:00",
          "giatrido": -9.625199000000002
        },
        {
          "fullTime": "2019-08-01T05:44:00",
          "giatrido": -9.607199000000001
        },
        {
          "fullTime": "2019-08-01T06:44:00",
          "giatrido": -9.5943
        }
      ]
    }
  }

  constructor() {
  }

  /* Các hàm cần sử dụng để lập biểu đồ
    // setSource()
    // preDataChart()
    // setChartName()
    // setYTittle()
    // setXTittle()
    // chartInit()
  /@by: Hùng
  */
  public options: any = {
    chart: {
      type: 'line',
      zoomType: 'x'
    }
  };
  public chart;
  public dataChart;
  public name: string;
  public titleY: string;
  public titleX: string;
  public fullTimeInput = [];
  public valueInput = [];
  public valueBefore = [];
  public valueAfter = [];
  public color = 'blue';
  public bgColor = '#ffffff';

  /* Các hàm chuẩn hóa data biểu đồ
  / Truyền vào: data biểu đồ
  /@by: Hùng
  */

  preDataChart(dataChart, para) {
    // dữ liệu nước
    this.valueInput = [];
    this.valueAfter = [];
    this.valueBefore = [];
    this.fullTimeInput = [];
    if (para == 'gw') {
      for (let i = 0; i < dataChart.monthInput.items.length; i++) {
        this.fullTimeInput.push(moment(dataChart.monthInput.items[i].fullTime).format('DD/MM/YYYY h:mm:ss'));
      }
      for (let i = 0; i < dataChart.monthInput.items.length; i++) {
        const n = (dataChart.monthInput.items[i].giatrido).toFixed(2);
        this.valueInput.push(+n);
      }
      for (let i = 0; i < dataChart.monthBefore.items.length; i++) {
        const n = (dataChart.monthBefore.items[i].giatrido).toFixed(2);
        this.valueBefore.push(+n);
      }
      for (let i = 0; i < dataChart.monthAfter.items.length; i++) {
        const n = (dataChart.monthAfter.items[i].giatrido).toFixed(2);
        this.valueAfter.push(+n);
      }
    } else if (para == 'wt') {

    }
  }


  /* Hàm tạo biểu đồ 1 tháng hiện tại
  / Truyền vào: element id, kiểu biểu đồ
  /@by: Hùng
  */
  chartInit1m(id: string, type: string) {
    const options: any = {
      chart: {
        backgroundColor: this.bgColor,
        type: type,
        zoomType: 'x'
      },

      title: {
        text: 'Biểu đồ đo ' + this.name
      },
      xAxis: {
        title: {
          text: this.titleX
        },
        categories: this.fullTimeInput,
        labels: {
          formatter() {
            return this.value.toString().substring(0, 10);
          }
        },
        tickInterval: 24
      },
      yAxis: {
        title: {
          text: this.titleY
        },
        gridLineWidth: 0
      },

      series: [
        {
          color: this.color,
          name: 'Tháng hiện tại',
          data: this.valueInput
        }
      ]
    };

    // Load module after Highcharts is loaded
    require('highcharts/modules/exporting')(Highcharts);

    Highcharts.chart(id, options);
  }

  /* Hàm tạo biểu đồ 3 tháng
  / Truyền vào: element id, kiểu biểu đồ
  /@by: Hùng
  */
  chartInit3m(id: string, type: string) {
    const options: any = {
      chart: {
        backgroundColor: this.bgColor,
        type: type,
        zoomType: 'x'
      },

      title: {
        text: this.name
      },
      xAxis: {
        title: {
          text: this.titleX
        },
        categories: this.fullTimeInput,
        labels: {
          formatter() {
            return this.value.toString().substring(0, 10);
          }
        },
        tickInterval: 24
      },
      yAxis: {
        title: {
          text: this.titleY
        }
      },

      series: [
        {
          color: '#fc0000',
          name: 'Tháng hiện tại',
          data: this.valueInput
        },
        {
          color: '#f6f7b7',
          name: 'Tháng sau',
          data: this.valueAfter
        },
        {
          color: '#dfedf5',
          name: 'Tháng trước',
          data: this.valueBefore
        }
      ],
    };

    // Load module after Highcharts is loaded
    require('highcharts/modules/exporting')(Highcharts);

    this.chart = Highcharts.chart(id, options);
  }

  /* Các hàm đặt tên biểu đồ
  / Truyền vào: tên biểu đồ
  /@by: Hùng
  */
  setChartName(name: string) {
    this.name = name;
  }

  /* Các hàm đặt data biểu đồ
  / Truyền vào: data biểu đồ
  /@by: Hùng
  */
  setSource(dataChart: any) {
    this.dataChart = dataChart;
  }

  // set trục x title
  setXTittle(tittle: string) {
    this.titleX = tittle;
  }

  // set trục y title
  setYTittle(tittle: string) {
    this.titleY = tittle;
  }

  // thay đổi màu line hiện tại
  changColor(color: string) {
    this.color = color;
  }

  // thay đổi màu back ground hiện tại
  changeBgColor(bgColor: string) {
    this.bgColor = bgColor;
  }


  // chuẩn hóa data
  preData(dataChart, time, value) {
    // dữ liệu nước
    this.valueInput = [];
    this.valueAfter = [];
    this.valueBefore = [];
    this.fullTimeInput = [];
    for (let i = 0; i < dataChart.monthInput.items.length; i++) {
      this.fullTimeInput.push(moment(dataChart.monthInput.items[i].fullTime).format('DD/MM/YYYY h:mm:ss'));
    }
    for (let i = 0; i < dataChart.monthInput.items.length; i++) {
      const n = (dataChart.monthInput.items[i].giatrido).toFixed(2);
      this.valueInput.push(+n);
    }
    for (let i = 0; i < dataChart.monthBefore.items.length; i++) {
      const n = (dataChart.monthBefore.items[i].giatrido).toFixed(2);
      this.valueBefore.push(+n);
    }
    for (let i = 0; i < dataChart.monthAfter.items.length; i++) {
      const n = (dataChart.monthAfter.items[i].giatrido).toFixed(2);
      this.valueAfter.push(+n);
    }


  }
}
