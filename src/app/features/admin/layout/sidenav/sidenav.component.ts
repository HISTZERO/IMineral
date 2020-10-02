import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { AuthService } from "src/app/services/auth/auth.service";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { SlideInOutAnimation } from "src/app/shared/constants/animations/slide-in-out";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  animations: [SlideInOutAnimation],
})
export class SidenavComponent implements OnInit {
  // Menu items
  listThietLapTram: any;
  menuCongTrinhKhacKttv: any = [];
  menuCongTrinhKhacTnnuoc: any = [];
  Eventsubscription: Subscription;

  // Thông tin user đăng nhập
  public img: string = "";
  public userName: string = "";
  public userFullName: string = "";

  // Menu
  public QuantriList: any[] = [
    {
      label: "ĐĂNG KÝ HOẠT ĐỘNG",
      faIcon: "fal fa-newspaper",
      items: [
        {
          label: "Thăm dò khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkthamdokhoangsanUri}`,
        },
        {
          label: "Phê duyệt trữ lượng khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkPheDuyetTruLuongUri}`,
        },
        {
          label: "Đấu giá quyền khai thác khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkDauGiaQuyenUri}`,
        },
        {
          label: "Khai thác khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkKhaithackhoangsanUri}`,
        },
        {
          label: "Tận thu khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkTanthukhoangsanUri}`
        },
        {
          label: "Trả lại giấy phép thăm do, khai thác",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkTralaigiayphepUri}`
        },
        {
          label: "Đóng cửa mỏ khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkDongcuamoUri}`
        },
        {
          label: "Chuyển nhượng quyền thăm dò, khai thác",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkChuyennhuongquyenUri}`
        }
      ]
    },
    {
      label: "CẤP PHÉP HOẠT ĐỘNG",
      faIcon: "fal fa-newspaper",
      items: [
        {
          label: "Thăm dò khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}/${AdminRoutingName.cpthamdokhoangsanUri}`
        },
        {
          label: "Phê duyệt trữ lượng khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}/${AdminRoutingName.cppheduyettruluongkhoangsanUri}`
        },
        {
          label: "Đấu giá quyền khai thác khoáng sản",
          faIcon: "far fa-th-list",
          link: ""
        },
        {
          label: "Khai thác khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}/${AdminRoutingName.cpkhaithackhoangsanUri}`
        },
        {
          label: "Tận thu khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}/${AdminRoutingName.cptanthukhoangsanUri}`
        },
        {
          label: "Trả lại giấy phép thăm do, khai thác",
          faIcon: "far fa-th-list",
          link: ""
        },
        {
          label: "Đóng cửa mỏ khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}/${AdminRoutingName.cpdongcuamokhoangsanUri}`
        },
        {
          label: "Chuyển nhượng quyền thăm dò, khai thác",
          faIcon: "far fa-th-list",
          link: ""
        }
      ]
    },
    {
      label: "TÍNH TIỀN CẤP QUYỀN",
      faIcon: "fal fa-newspaper",
      link: ""
    },
    {
      label: "KHU VỰC KHOÁNG SẢN",
      faIcon: "fal fa-newspaper",
      link: "",
      items: [
        {
          label: "Khu vực cấm/tạm cấm",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}/${AdminRoutingName.khuvuccamtamcamUri}`,
        },
        {
          label: "Khu vực đấu giá",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}/${AdminRoutingName.khuvucdaugiaUri}`,
        },
        {
          label: "Khu vực khoáng sản độc hại",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}/${AdminRoutingName.khuvuckhoangsandochaiUri}`,
        },
        {
          label: "Khu vực không đấu giá",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}/${AdminRoutingName.khuvuckhongdaugiaUri}`
        },
        {
          label: "Khu vực dự trữ khoáng sản",
          faIcon: "far fa-th-list",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}/${AdminRoutingName.khuvucdutrukhoangsanUri}`
        },
        {
          label: "Khu vực thăm dò khoáng sản",
          faIcon: "far fa-th-list",
          link: ``
        },
      ]
    },
    {
      label: "MỎ QUẶNG, ĐIỂM QUẶNG",
      faIcon: "fal fa-newspaper",
      link: "",
      items: [
        {
          label: "Quản lý mỏ khoáng sản",
          faIcon: "far fa-th-list",
          link: ``
        },
        {
          label: "Quản lý điểm quặng",
          faIcon: "far fa-th-list",
          link: `${AdminRoutingName.adminUri}/${AdminRoutingName.diemquangmoquangUri}/${AdminRoutingName.diemquangUri}`
        },
      ]
    },
    {
      label: "QUY HOẠCH KHOÁNG SẢN",
      faIcon: "fal fa-newspaper",
      link: ""
    },
    {
      label: "DỮ LIỆU KHÔNG GIAN",
      faIcon: "fal fa-globe",
      items: [
        {
          label: "Lớp bản đồ",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}/${AdminRoutingName.lopbandoUri}`,
          faIcon: "fal fa-layer-group",
        },
        {
          label: "Nhóm lớp bản đồ",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}/${AdminRoutingName.nhomlopbandoUri}`,
          faIcon: "fal fa-folders",
        },
        {
          label: "Bản đồ",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}/${AdminRoutingName.bandoUri}`,
          faIcon: "fal fa-map-marked-alt",
        },
        {
          label: "Nhóm bản đồ",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}/${AdminRoutingName.nhombandoUri}`,
          faIcon: "fal fa-atlas",
        },
        {
          label: "Hệ tọa độ",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}/${AdminRoutingName.hetoadoUri}`,
          faIcon: "fal fa-globe-stand",
        },
      ],
    },
    {
      label: "BÁO CÁO HOẠT ĐỘNG",
      faIcon: "fal fa-newspaper",
      link: "",
      items: [
        {
          label: "Báo cáo điều tra khảo sát khoáng sản",
          faIcon: "far fa-th-list",
          link: `${AdminRoutingName.adminUri}/${AdminRoutingName.baocaoUri}/${AdminRoutingName.danhsach}/${AdminRoutingName.dieutrakhaosatUri}`
        },
        {
          label: "Báo cáo định kỳ hoạt động khoáng sản",
          faIcon: "far fa-th-list",
          link: `${AdminRoutingName.adminUri}/${AdminRoutingName.baocaoUri}/${AdminRoutingName.danhsach}/${AdminRoutingName.baocaohoatdongdinhkyUri}`
        },
        {
          label: "Báo cáo giám sát hoạt động khoáng sản",
          faIcon: "far fa-th-list",
          link: `${AdminRoutingName.adminUri}/${AdminRoutingName.baocaoUri}/${AdminRoutingName.danhsach}/${AdminRoutingName.giamsathoatdongUri}`
        },
        {
          label: "Thông tin tư liệu khoáng sản",
          faIcon: "far fa-th-list",
          link: `${AdminRoutingName.adminUri}/${AdminRoutingName.baocaoUri}/${AdminRoutingName.danhsach}/${AdminRoutingName.thongtintulieuUri}`
        }
      ]
    },
    {
      label: "VĂN BẢN PHÁP QUY",
      faIcon: "fal fa-newspaper",
      link: ""
    },
    {
      label: "DANH MỤC",
      faIcon: "far fa-clipboard",
      link: "",
      items: [
        {
          label: "Cá nhân",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.canhanUri}`,
          faIcon: "far fa-user",
        },
        {
          label: "Cấp quản lý",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.capquanlyUri}`,
          faIcon: "far fa-building",
        },
        {
          label: "Cấp tài nguyên",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.captainguyenUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Cấp trữ lượng",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.captruluongUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Cơ quan quản lý",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.coquanquanlyUri}`,
          faIcon: "fal fa-landmark-alt",
        },
        {
          label: "Đơn vị hành chính",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.dvhcUri}`,
          faIcon: "far fa-map-marked-alt",
        },
        {
          label: "Loại báo cáo",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.loaibaocaoUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Loại cấp phép",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.loaicapphepUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Loại giấy phép",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.loaigiayphepUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Loại khoáng sản",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.loaikhoangsanUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Loại tài liệu",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.loaitailieuUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Loại tổ chức",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.loaitochucUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Nguồn gốc mỏ",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.nguongocmoUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Nhóm khoáng sản",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.nhomkhoangsanUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Thử tục hành chính",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.thutuchanhchinhUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Tổ chức",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.tochucUri}`,
          faIcon: "far fa-th-list",
        },
        {
          label: "Lĩnh vực",
          link: `/${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.linhvucUri}`,
          faIcon: "far fa-th-list",
        },
      ]
    },
    {
      label: "THIẾT LẬP",
      faIcon: "fas fa-cog",
      items: [
        {
          label: "Thiết lập hệ thống",
          link: `${AdminRoutingName.adminUri}/${AdminRoutingName.thietlapUri}/${AdminRoutingName.ThietLapHeThong}`,
          faIcon: "fas fa-cog",
        },
        {
          label: "Cấu hình tài liệu",
          link: `${AdminRoutingName.adminUri}/${AdminRoutingName.thietlapUri}/${AdminRoutingName.CauHinhTaiLieu}`,
          faIcon: "fas fa-cog",
        },
        {
          label: "Cấu hình cơ quan tiếp nhận",
          link: `${AdminRoutingName.adminUri}/${AdminRoutingName.thietlapUri}/${AdminRoutingName.CoQuanTiepNhan}`,
          faIcon: "fas fa-cog",
        },
        {
          label: "Cấu hình cơ quan cấp phép",
          link: `${AdminRoutingName.adminUri}/${AdminRoutingName.thietlapUri}/${AdminRoutingName.CoQuanCapPhep}`,
          faIcon: "fas fa-cog",
        },
      ],
    },
    {
      label: "TIỆN ÍCH",
      link: "",
      faIcon: "far fa-clipboard",
      items: [
        {
          label: "Chuyển đổi dữ liệu",
          link: "",
          faIcon: "far fa-th-list",
        }
      ]
    },
    {
      label: "THƯ VIỆN",
      faIcon: "fas fa-photo-video",
      link: "/admin/" + AdminRoutingName.thuvienUri,
    }
  ];

  constructor(
    public router: Router,
    public authService: AuthService,
    public thietlapFacadeService: ThietlapFacadeService,
  ) {
  }

  ngOnInit() {
    let userInfo = this.authService.getUser();
    this.userFullName = userInfo.given_name;
    this.userName = userInfo.name;
  }

  /**
   * Thêm/xóa class active cho các thẻ menu
   * @param event Event
   */
  toggleActiveTarget(event: any) {

    let menus: Element = event.target.closest("ul.nav-sidebar");
    let menuItems: any = menus.querySelectorAll(".nav-link.active");
    Array.from(menuItems).map((item: any) => {
      item.className = item.className.replace(' active', '');
    })

    event.target.className += ' active';
  }

  /**
   * Hàm kích hoạt khi click vào menu tên sidebar
   * @param event Sự kiện click vào element
   * @param item Đối tượng click
   */
  onClickMenu(event: any, item) {
    event.stopPropagation();

    // Active menu
    this.toggleActiveTarget(event);

    // Element cha của đối tượng đang click (thẻ <li><doi_tuong_dang_click/></li>)
    let parentElement: Element = event.target.closest("li");

    // Danh sách list ở trên trong element cha <element_cha><ul>...</ul><element_cha>
    let listChildElement: Element = parentElement.querySelector("ul");

    // Mở menu con
    if (parentElement.className.indexOf("nav-item-open") === -1) {
      parentElement.className += " nav-item-open";
      if (listChildElement) {
        item.animationState = "in";
        listChildElement.className += " open";
      }
    } else {
      parentElement.className = parentElement.className.replace(
        " nav-item-open",
        ""
      );
      if (listChildElement) {
        item.animationState = "out";
        listChildElement.className = listChildElement.className.replace(
          " open",
          ""
        );
      }
    }

    // Chuyển hướng website
    if (item.link) {
      this.router.navigateByUrl(item.link);
    }
  }
}
