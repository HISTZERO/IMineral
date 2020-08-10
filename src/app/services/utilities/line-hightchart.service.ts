import { Injectable, Type } from "@angular/core";
import * as Highcharts from "highcharts";
import * as moment from "moment-mini";

declare var require: any;

@Injectable({
  providedIn: "root",
})
export class LineHightchartService {
  public chartElementId: string;
  public myChart: any;
  public showData = [];
  public chartColors = {
    blue: "rgb(54, 162, 235)",
    yellow: "rgb(255, 205, 86)",
    red: "rgb(255, 99, 132)",
    orange: "rgb(255, 159, 64)",
    green: "rgb(75, 192, 192)",
    purple: "rgb(153, 102, 255)",
    grey: "rgb(231,233,237)",
  };
  /* Các hàm cần sử dụng để lập biểu đồ
    // setSource()
    // preDataChart()
    // setChartName()
    // setYTittle()
    // setXTittle()
    // initChart()
    // @by: dzung
    // @from: Hùng
  */
  public options: any = {
    chart: {
      type: "line",
      zoomType: "x",
    },
  };
  public chart;
  public typeChart: any;
  public dataChart;
  public name: string;
  public titleY: string;
  public titleX: string;
  public fullTimeInput = [];
  public valueInput = [];
  public color = this.chartColors.blue;
  public bgColor = "#ffffff";
  public chartHeight: number;

  /*
  //Thiết lập DOM id sẽ chứa biểu đồ
  */
  public setElement(id: string) {
    this.chartElementId = id;
  }

  /* Các hàm đặt tên biểu đồ
  / Truyền vào: tên biểu đồ
  /@by: dzung
  */
  setChartName(name: string) {
    this.name = name;
  }
  /* Các hàm đặt data biểu đồ
  / Truyền vào: data biểu đồ
  /@by: dzung
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

  setChartHeight(height: number) {
    this.chartHeight = height;
  }

  /* Hàm chuẩn hóa data biểu đồ
  / Truyền vào: data biểu đồ
  /@by: dzung
  /@start: Hùng
  /@update: Tiến
  */

  // Hàm check loại biểu đồ
  checkTypeChart(data) {
    if (data) {
      for (let i of data) {
        if (i === "column") {
          this.typeChart = i;
        } else {
          this.typeChart = "line";
        }
      }
    } else {
      this.typeChart = "line";
    }
  }

  // Hàm xử lý dữ liệu có nhiều trường dữ liệu để hiển thị lên trên biểu đồ
  public preMultiDataChart(
    dataChart,
    fieldName: string[] = ["ketquado"],
    idShowChart,
    tagArray,
    tenKetQua?: any[]
  ) {
    this.fullTimeInput = [];
    this.showData = [];
    const color = [];
    this.checkTypeChart(tagArray);
    // Vòng lặp For tạo ra mạng chứa các color
    for (let i in this.chartColors) {
      color.push(i);
    }
    // Vòng lặp For xử lý dữ liệu ngày tháng
    for (let i = 0; i < dataChart.length; i++) {
      this.fullTimeInput.push(
        moment(dataChart[i].fullTime).format("DD/MM/YYYY HH:mm:ss")
      );
    }

    fieldName.map((name, index) => {
      let valueInput: any = [];
      let nameData: any;
      if (tenKetQua) {
        nameData = tenKetQua[index];
      } else {
        nameData = "Dữ liệu đo";
      }
      const indexFieldName: any = fieldName[index];
      for (let i = 0; i < dataChart.length; i++) {
        const n = dataChart[i][indexFieldName].toFixed(2);
        valueInput.push(+n);
      }
      this.showData.push({
        yAxis: index,
        color: this.chartColors[color[index]],
        name: nameData,
        data: valueInput,
        lineWidth: 1,
        marker: {
          radius: 3,
        },
      });
    });
    this.initMultiDataChart(idShowChart, this.typeChart);
  }

  // Hàm khởi tạo biểu đồ dạng line, time series data
  public initMultiDataChart(id: string, chartType: string = "line") {
    const options: any = {
      // Tùy chọn hiển thị line dữ liệu
      series: this.showData,
      chart: {
        backgroundColor: this.bgColor,
        type: chartType,
        zoomType: "x",
        height: this.chartHeight,
        margin: [60, 50, 100, 50],
        style: {
          fontFamily: "Roboto",
        },
        renderTo: document.getElementById(id),
      },

      title: {
        text: this.name,
      },
      credits: {
        enabled: false,
      },
      // Thiết lập trục x; type là datetime giúp giãn cách dữ liệu theo thời gian
      xAxis: {
        type: "datetime",
        categories: this.fullTimeInput,

        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yAxis: [
        {
          //--- Primary yAxis
          title: {
            text: this.titleY,
          },
          labels: {
            style: {
              fontSize: "12px",
            },
          },
          gridLineWidth: 1,
        },
        {
          //--- Secondary yAxis
          title: {
            text: this.titleY,
          },
          labels: {
            style: {
              fontSize: "12px",
            },
          },
          gridLineWidth: 1,
          opposite: true,
        },
      ],
      legend: {
        layout: "horizontal",
        align: "center",
        verticalAlign: "top",
        x: 0,
        y: 0,
      },
    };
    // Load module after Highcharts is loaded
    require("highcharts/modules/exporting")(Highcharts);
    this.myChart = Highcharts.chart(id, options);
  }

  // Hàm xử lý dữ liệu time series trước khi vẽ biểu đồ. Dữ liệu thời gian sẽ được format đúng định dạng
  public preTsData(dataChart) {
    // empty array for storing the chart data
    this.valueInput = [];
    for (let i = 0; i < dataChart.length; i++) {
      this.valueInput.push([
        Date.parse(dataChart[i].fullTime),
        parseFloat(dataChart[i].ketquado.toFixed(2)),
      ]);
    }
  }

  // Hàm khởi tạo biểu đồ dạng line, time series data
  public initTsChart(id: string, chartType: string = "column") {
    const options: any = {
      // Hiệu chỉnh timezone về giờ VN
      time: {
        timezoneOffset: -7 * 60,
      },
      // Tùy chọn hiển thị line dữ liệu
      series: [
        {
          color: this.color,
          name: "Dữ liệu đo",
          data: this.valueInput,
          lineWidth: 1,
          marker: {
            radius: 3,
          },
        },
      ],
      chart: {
        backgroundColor: this.bgColor,
        type: chartType,
        zoomType: "x",
        height: this.chartHeight,
        margin: [60, 50, 100, 50],
        style: {
          fontFamily: "Roboto",
        },
        renderTo: document.getElementById(id),
      },

      title: {
        text: this.name,
      },
      credits: {
        enabled: false,
      },
      // Thiết lập trục x; type là datetime giúp giãn cách dữ liệu theo thời gian
      xAxis: {
        type: "datetime",
        labels: {
          style: {
            fontSize: "12px",
          },
        },
        dateTimeLabelFormats: {
          second: "%d-%m-%Y<br/>%H:%M:%S",
          minute: "%d-%m-%Y<br/>%H:%M",
          hour: "%d-%m-%Y<br/>%H:%M",
          day: "%d-%m<br/>%Y",
          week: "%d-%m<br/>%Y",
          month: "%m-%Y",
          year: "%Y",
        },
      },
      yAxis: {
        labels: {
          style: {
            fontSize: "12px",
          },
        },
        title: {
          text: this.titleY,
        },
        gridLineWidth: 0,
      },
      legend: {
        layout: "horizontal",
        align: "center",
        verticalAlign: "top",
        x: 0,
        y: 0,
      },
    };
    // Load module after Highcharts is loaded
    require("highcharts/modules/exporting")(Highcharts);
    this.myChart = Highcharts.chart(id, options);
  }

  preDataChart(dataChart, fieldName: string = "ketquado") {
    this.fullTimeInput = [];
    this.valueInput = [];
    for (let i = 0; i < dataChart.length; i++) {
      this.fullTimeInput.push(
        moment(dataChart[i].fullTime).format("DD/MM/YYYY h:mm:ss")
      );
    }
    for (let i = 0; i < dataChart.length; i++) {
      const n = dataChart[i][fieldName].toFixed(2);
      this.valueInput.push(+n);
    }
  }
  public initChart(id: string, chartType: string) {
    const options: any = {
      time: {
        timezoneOffset: -7 * 60,
      },
      chart: {
        backgroundColor: this.bgColor,
        type: chartType,
        zoomType: "x",
        style: {
          fontFamily: "Roboto",
        },
      },

      title: {
        text: this.name,
      },
      xAxis: {
        title: {
          text: this.titleX,
        },
        categories: this.fullTimeInput,
        labels: {
          formatter() {
            return this.value.toString().substring(0, 10);
          },
        },
        tickInterval: 24,
      },
      yAxis: {
        title: {
          text: this.titleY,
        },
        gridLineWidth: 0,
      },

      series: [
        {
          color: this.color,
          name: "Dữ liệu đo",
          data: this.valueInput,
          lineWidth: 1,
          marker: {
            radius: 3,
          },
        },
      ],
    };
    // Load module after Highcharts is loaded
    require("highcharts/modules/exporting")(Highcharts);
    this.myChart = Highcharts.chart(id, options);
  }

  constructor() { }
}
