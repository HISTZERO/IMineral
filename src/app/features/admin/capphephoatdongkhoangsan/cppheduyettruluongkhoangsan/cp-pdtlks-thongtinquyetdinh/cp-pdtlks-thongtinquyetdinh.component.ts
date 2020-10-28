import { Component, Input, OnInit, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from "@angular/router";
import { CpPheDuyetTLKS_ThongTinQuyetDinhTabEnum } from "src/app/shared/constants/enum";
import { CpPdtlksKhuvucComponent } from './cp-pdtlks-khuvuc/cp-pdtlks-khuvuc.component';
import { CpPdtlksLoaikhoangsanComponent } from './cp-pdtlks-loaikhoangsan/cp-pdtlks-loaikhoangsan.component';

@Component({
  selector: "app-cp-pdtlks-thongtinquyetdinh",
  templateUrl: "./cp-pdtlks-thongtinquyetdinh.component.html",
  styleUrls: ["./cp-pdtlks-thongtinquyetdinh.component.scss"],
})
export class CpPdtlksThongtinquyetdinhComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}
  //id phê duyệt trữ lượng : sử dụng để truyền dữ liệu cho các tab con
  public idpheduyettruluong:string;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  // Lưu trữ thông tin đăng ký tab
  public TabType = CpPheDuyetTLKS_ThongTinQuyetDinhTabEnum;
  public disabledTabState: any = {
    [this.TabType.ThongTinChiTiet]: false,
    [this.TabType.LoaiKhoangSan]: true,
    [this.TabType.TruLuongKhuVuc]: true,
    [this.TabType.KhoiLuongTruLuong]: true,
  };
  @ViewChild("loaiKhoangSanTab",{ static: false }) loaiKhoangSanTab : CpPdtlksLoaikhoangsanComponent;
  @ViewChild("khuvuckhoangsanTab",{ static: false }) khuVucTab :CpPdtlksKhuvucComponent;
    ;


  ngOnInit() {
  }

  public loadedTabState: any = {
    [this.TabType.LoaiKhoangSan]: false,
    [this.TabType.TruLuongKhuVuc]: false,
    [this.TabType.KhoiLuongTruLuong]: false
  };

  //chuyển tab
  async tabChange(index: any) {
    if(index===this.TabType.LoaiKhoangSan && !this.loadedTabState[this.TabType.LoaiKhoangSan]){
      this.loadedTabState[this.TabType.LoaiKhoangSan]=true;
      this.loaiKhoangSanTab.idPheDuyetTruLuong=this.idpheduyettruluong;
      this.loaiKhoangSanTab.content=this.content;
      this.loaiKhoangSanTab.matSidenav=this.matSidenav;
      this.loaiKhoangSanTab.manualDataInit();

    }
    else if(index===this.TabType.TruLuongKhuVuc && !this.loadedTabState[this.TabType.TruLuongKhuVuc]){
      this.loadedTabState[this.TabType.TruLuongKhuVuc]=true;
      this.khuVucTab.idPheDuyetTruLuong=this.idpheduyettruluong;
      this.khuVucTab.content=this.content;
      this.khuVucTab.matSidenav=this.matSidenav;
      this.khuVucTab.manualDataInit();

    }
  }

  //xử lý khi thông tin chi tiết được tạo
  thongTinChiTietVuaTaoHandler(idpheduyettruluong:any):void{
    this.disabledTabState[this.TabType.LoaiKhoangSan]=false;
    this.disabledTabState[this.TabType.TruLuongKhuVuc]=false;
    this.disabledTabState[this.TabType.KhoiLuongTruLuong]=false;
    this.idpheduyettruluong=idpheduyettruluong;
  }
  //xử lý khi thông tin chi tiết bị xóa
  thongTinChiTietKhongTonTaiHandler():void{
    this.disabledTabState[this.TabType.LoaiKhoangSan]=true;
    this.disabledTabState[this.TabType.TruLuongKhuVuc]=true;
    this.disabledTabState[this.TabType.KhoiLuongTruLuong]=true;
    this.idpheduyettruluong=null;

  }
}
