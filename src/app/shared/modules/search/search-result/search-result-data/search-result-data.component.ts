import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from "@angular/router";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-grids";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { PublicSearchService } from "src/app/services/public/public-search.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-search-result-data',
  templateUrl: './search-result-data.component.html',
  styleUrls: ['./search-result-data.component.scss']
})
export class SearchResultDataComponent implements OnInit, OnChanges {
  @Input() objkey: any;
  @Input() keyvalue: any;
  @Input() version: any;

  @ViewChild("grid", { static: false }) public grid: GridComponent;

  // Vietsub tên thuộc tính data
  vietsubData = {
    location: "Vị trí",
    name: "Tên công trình",
    organization: "Cơ quan tổ chức"
  }
  public id: number;
  public name: any;
  public routerlv1: any;
  public routerUri: any;
  public routerlv3: any;
  public routerlv4: any;
  private pageSize: any;
  private pageNumber: any;
  public state: DataStateChangeEventArgs;
  public settingsCommon = new SettingsCommon();
  public listData: Observable<DataStateChangeEventArgs>;
  // public  listData: any;
  private listDataLoaitram: any;

  constructor(
    public commonFacadeService: CommonFacadeService,
    public thietlapFacadeService: ThietlapFacadeService,
    public router: Router,
    public commonService: CommonServiceShared,
    public publicService: PublicSearchService,
  ) {
  }

  async ngOnInit() {
    this.getPagesize();
    this.listDataLoaitram = await this.commonFacadeService.getObjKeyService().getFetchAll();
  }

  async ngOnChanges() {
    if (this.pageSize) {
      await this.getSearchData();
    }
  }

  // Hàm khi gọi đến search data
  async getSearchData() {
    if (!this.objkey || this.objkey === 0) {
      this.objkey = '';
    }
    this.listData = this.publicService;
    // if (this.keyvalue) {
    // console.log(this.keyvalue);
    // this.listData = await this.publicService.getFetchSearchData({ skip: 0, take: +this.pageSize }, { KeyValue: this.keyvalue, ObjKey: this.objkey, PageNumber: 1, PageSize: this.pageSize,  })
    //   // .subscribe(res => this.listData = res);
    // console.log(this.listData);
    // }
    // else {
    this.publicService.getSearchData({ skip: 0, take: +this.pageSize }, { KeyValue: this.keyvalue, ObjKey: this.objkey });
    // // }
  }
  //
  async dataStateChange(state: DataStateChangeEventArgs) {
    // if (this.keyvalue) {
    // await this.publicService.getSearchData(state, { ObjKey: this.objkey, KeyValue: this.keyvalue }).subscribe(res => this.listData = res);
    // }
    // else {
    this.publicService.getSearchData(state, { ObjKey: this.objkey, KeyValue: this.keyvalue });
    //     // }
  }

  // Hàm lấy ra page size được lưu trong server
  async getPagesize() {
    this.pageSize = await this.thietlapFacadeService.getThietLapHeThongService().getByid(ThietLapHeThong.listPageSize).toPromise();
    this.settingsCommon.pageSettings.pageSize = +this.pageSize;

    // Hàm gọi khi search data
    this.getSearchData();
  }

  // setRouterLink(data) {
  //   // let routerLink: Router;
  //   let routerlv1: any;
  //   let routerUri: any;
  //   let routerlv3: any;
  //   let routerlv4: any;
  //   switch (data.objKey) {
  //     // GiengQuantrac = 1;
  //     case 1:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.wrUri;
  //       routerlv3 = AdminRoutingName.gwUri;
  //       routerlv4 = AdminRoutingName.wellsUri;
  //       break;
  //     // GiengKhaiThac = 3;
  //     case 3:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.wrUri;
  //       routerlv3 = AdminRoutingName.gwexUri;
  //       routerlv4 = AdminRoutingName.wellexUri;
  //       break;
  //     // DiemXaThai = 6;
  //     case 6:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.kttvUri;
  //       routerlv3 = AdminRoutingName.diUri;
  //       routerlv4 = AdminRoutingName.pdiUri;
  //       break;
  //     // KhaiThacNuocMat = 5;
  //     case 5:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.kttvUri;
  //       routerlv3 = AdminRoutingName.swexUri;
  //       routerlv4 = AdminRoutingName.swDiemkhaithac;
  //       break;
  //     // TramQuanTracNDD = 2;
  //     case 2:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.wrUri;
  //       routerlv3 = AdminRoutingName.gwUri;
  //       routerlv4 = AdminRoutingName.gwStationUri;
  //       break;
  //     // TramQuanTracNM = 4;
  //     case 4:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.wrUri;
  //       routerlv3 = AdminRoutingName.swUri;
  //       routerlv4 = AdminRoutingName.CongTrinhTramQtnm;
  //       break;
  //     // TramBom = 7;
  //     case 7:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.wrUri;
  //       routerlv3 = AdminRoutingName.swTramBomUri;
  //       routerlv4 = AdminRoutingName.swTrambom;
  //       break;
  //     // TramKttv = 23;
  //     case 23:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.kttvUri;
  //       routerlv3 = AdminRoutingName.TramKttv;
  //       routerlv4 = AdminRoutingName.CongTrinhTramKttv;
  //       break;
  //     // TramKtBeMat = 24;
  //     case 24:
  //       this.routerlv1 = AdminRoutingName.adminUri;
  //       this.routerUri = AdminRoutingName.kttvUri;
  //       this.routerlv3 = AdminRoutingName.kttvTramKtBeMat;
  //       this.routerlv4 = AdminRoutingName.CongTrinhTramKtBeMat;
  //       break;
  //     // TramKtNongNghiep = 25;
  //     case 25:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.kttvUri;
  //       routerlv3 = AdminRoutingName.kttvTramKtNongNghiep;
  //       routerlv4 = AdminRoutingName.CongTrinhTramKtBeMat;
  //       break;
  //     // TramKtTrenCao = 26;
  //     case 26:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.kttvUri;
  //       routerlv3 = AdminRoutingName.kttvTramKtTrenCao;
  //       routerlv4 = AdminRoutingName.CongTrinhTramKtTrenCao;
  //       break;
  //     // TramRadaThoiTiet = 27;
  //     case 27:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.kttvUri;
  //       routerlv3 = AdminRoutingName.kttvTramRadaThoiTiet;
  //       routerlv4 = AdminRoutingName.CongTrinhTramRadaThoiTiet;
  //       break;
  //     // TramThuyVan = 28;
  //     case 28:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.kttvUri;
  //       routerlv3 = AdminRoutingName.kttvTramThuyVan;
  //       routerlv4 = AdminRoutingName.CongTrinhTramThuyVan;
  //       break;
  //     // TramHaiVan = 29;
  //     case 29:
  //       routerlv1 = AdminRoutingName.adminUri;
  //       routerUri = AdminRoutingName.kttvUri;
  //       routerlv3 = AdminRoutingName.kttvTramHaiVan;
  //       routerlv4 = AdminRoutingName.CongTrinhTramHaiVan;
  //       break;
  //   }
  //   return routerlv1 + "/" + routerUri + "/" + routerlv3 + "/"
  //     + routerlv4 + "/" + data.idDoituong;
  // }
  // Lấy ra tên của giếng từ data
  getName(data) {
    for (const item of data.list) {
      if (item.tenthuoctinh === "name") {
        return this.highlight(this.keyvalue, item.giatri);
      }
    }
  }

  // Lấy ra vị trí của giếng từ data
  getLocation(data) {
    for (const item of data.list) {
      if (item.tenthuoctinh === "location") {
        return this.highlight(this.keyvalue, item.giatri);
      }
    }
  }

  // Lấy ra tên cơ quan của giếng từ data
  getOrganization(data) {
    for (const item of data.list) {
      if (item.tenthuoctinh === "organization") {
        return this.highlight(this.keyvalue, item.giatri);
      }
    }
  }

  getObjkeyName(data) {
    for (const loaitram of this.listDataLoaitram) {
      if (data.objKey === loaitram.objKey) {
        return this.highlight(this.keyvalue, loaitram.objName);
      }
    }
  }
  // Lấy data đơn vị hành chính
  getDvhc(data) {
    console.log(data)
    let tenXa: any;
    let tenHuyen: any;
    let tenTinh: any;
    let dvhc: any;
    for (const item of data.list) {
      if (item.tenthuoctinh === "provinceName") {
        tenTinh = item.giatri;
      }
      if (item.tenthuoctinh === "districtName") {
        tenHuyen = item.giatri;
      }
      if (item.tenthuoctinh === "wardName") {
        tenXa = item.giatri;
      }
      dvhc = tenXa + ' ' + tenHuyen + ' ' + tenTinh;
    }
    return this.highlight(this.keyvalue, dvhc);
  }
  // tslint:disable-next-line:variable-name
  highlight(query: any, content: any) {
    if (!query || content == null || content === '') {
      return content = 'Chưa có thông tin';
    } else {
      return content.replace(new RegExp(query, "gi"), match => {
        return '<span class="highlightText">' + match + '</span>';
      });
    }
  }

  doFunction(methodName) {
    this[methodName]();
  }
}
