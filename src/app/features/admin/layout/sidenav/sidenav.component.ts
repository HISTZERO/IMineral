import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { AuthService } from "src/app/services/auth/auth.service";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { ObjKey } from "src/app/shared/constants/objkey-constants";
import { CallFunctionService } from "src/app/services/utilities/call-function.service";
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
    // {
    //   label: "HỆ THỐNG",
    //   faIcon: "fas fa-server",
    //   items: [
    //     {
    //       label: "Hệ thống log",
    //       link:
    //         "/admin/" +
    //         AdminRoutingName.hethongUri +
    //         "/" +
    //         AdminRoutingName.hethongLog,
    //       faIcon: "fas fa-marker",
    //     },
    //   ],
    // },
    {
      label: "THIẾT LẬP",
      faIcon: "fas fa-cog",
      items: [
        {
          label: "Thiết lập hệ thống",
          link:
            "/admin/" +
            AdminRoutingName.thietlapUri +
            "/" +
            AdminRoutingName.ThietLapHeThong,
          faIcon: "fas fa-cog",
        },
        {
          label: "Thiết lập trạm",
          link:
            "/admin/" +
            AdminRoutingName.thietlapUri +
            "/" +
            AdminRoutingName.ThietLapTram,
          faIcon: "fas fa-cog",
        },
        {
          label: "Thiết lập dữ liệu",
          link:
            "/admin/" +
            AdminRoutingName.thietlapUri +
            "/" +
            AdminRoutingName.ThietLapDuLieu,
          faIcon: "fas fa-cog",
        },
        {
          label: "Danh mục dữ liệu",
          faIcon: "far fa-clipboard",
          items: [
            {
              label: "Cá nhân",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.canhanUri,
              faIcon: "far fa-user",
            },
            {
              label: "Công ty",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.congtyUri,
              faIcon: "far fa-building",
            },
            {
              label: "Cơ quan/Tổ chức",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.coquanUri,
              faIcon: "fal fa-landmark-alt",
            },
            {
              label: "Đơn vị hành chính",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.dvhcUri,
              faIcon: "far fa-map-marked-alt",
            },
            {
              label: "Tầng chứa nước",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.tangchuanuocUri,
              faIcon: "far fa-layer-group",
            },
            {
              label: "Đơn vị đo",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.donvidoUri,
              faIcon: "far fa-sort-amount-up-alt",
            },
            {
              label: "Hướng gió",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.huonggioUri,
              faIcon: "fas fa-wind",
            },
            {
              label: "Tiêu chuẩn",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.tieuchuanUri,
              faIcon: "far fa-books",
            },
            {
              label: "Nhóm tham số",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.nhomthamsoUri,
              faIcon: "far fa-list-ul",
            },
            {
              label: "Tham số",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.thamsoUri,
              faIcon: "fab fa-elementor",
            },
            {
              label: "Tiêu chuẩn chất lượng",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.tcclUri,
              faIcon: "fab fa-elementor",
            },
            {
              label: "Dự án",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.duanUri,
              faIcon: "far fa-project-diagram",
            },
            {
              label: "Loại số liệu",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.loaisolieuUri,
              faIcon: "fab fa-elementor",
            },
            {
              label: "Thiết bị quan trắc",
              link:
                "/admin/" +
                AdminRoutingName.danhmucUri +
                "/" +
                AdminRoutingName.thietbiquantracUri,
              faIcon: "fab fa-elementor",
            },
            {
              label: "Hệ tọa độ",
              link:
                "/admin/" +
                AdminRoutingName.mapUri +
                "/" +
                AdminRoutingName.hetoadoUri,
              faIcon: "fal fa-globe-stand",
            },
          ],
        },
      ],
    },
    // {
    //   label: "MÔI TRƯỜNG",
    //   faIcon: "fal fa-leaf",
    //   items: [
    //     {
    //       label: "Chất lượng không khí",
    //       faIcon: "far fa-wind",
    //       items: [
    //         {
    //           label: "Công trình quan trắc",
    //           faIcon: "far fa-building",
    //           link:
    //             "/admin/" +
    //             AdminRoutingName.enUri +
    //             "/" +
    //             AdminRoutingName.enTramAqi +
    //             "/" +
    //             AdminRoutingName.enAqiCongtrinh,
    //         },
    //       ],
    //     },
    //     {
    //       label: "Giám sát khí thải",
    //       faIcon: "far fa-wind-warning",
    //       items: [
    //         {
    //           label: "Công trình quan trắc",
    //           faIcon: "far fa-building",
    //           link:
    //             "/admin/" +
    //             AdminRoutingName.enUri +
    //             "/" +
    //             AdminRoutingName.enKhithai +
    //             "/" +
    //             AdminRoutingName.enKhithaiCongtrinh,
    //         },
    //       ],
    //     },
    //     {
    //       label: "Trạm môi trường nước",
    //       faIcon: "far fa-house-flood",
    //       items: [
    //         {
    //           label: "Công trình quan trắc",
    //           faIcon: "far fa-building",
    //           link:
    //             "/admin/" +
    //             AdminRoutingName.enUri +
    //             "/" +
    //             AdminRoutingName.enMoitruongnuoc +
    //             "/" +
    //             AdminRoutingName.enMoitruongnuocCongtrinh,
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   label: "TÀI NGUYÊN NƯỚC",
    //   faIcon: "far fa-dewpoint",
    //   link: `${AdminRoutingName.adminUri}/${AdminRoutingName.quantrac}/${TENLINHVUC.TAINGUYENNUOC}`,
    //   items: [
    //     {
    //       label: "Quan trắc nước mặt",
    //       faIcon: "far fa-monitor-heart-rate",
    //       link: `${AdminRoutingName.adminUri}/${AdminRoutingName.quantrac}/${AdminRoutingName.wrUri}/${ObjKey.TramQuanTracNM}`,
    //       items: [
    //         {
    //           label: "Công trình quan trắc nước mặt",
    //           link: `${AdminRoutingName.adminUri}/${AdminRoutingName.danhsachtram}/${ObjKey.TramQuanTracNM}`,
    //         },
    //       ],
    //     },
    //     {
    //       label: "Khai thác nước mặt",
    //       faIcon: "far fa-monitor-heart-rate",
    //       link: `${AdminRoutingName.adminUri}/${AdminRoutingName.quantrac}/${AdminRoutingName.wrUri}/${ObjKey.KhaiThacNuocMat}`,
    //       items: [
    //         {
    //           label: "Công trình khai thác nước mặt",
    //           link: `${AdminRoutingName.adminUri}/${AdminRoutingName.danhsachtram}/${ObjKey.KhaiThacNuocMat}`,
    //         },
    //       ],
    //     },
    //     {
    //       label: "Trạm bơm",
    //       faIcon: "far fa-monitor-heart-rate",
    //       link: `${AdminRoutingName.adminUri}/${AdminRoutingName.quantrac}/${AdminRoutingName.wrUri}/${ObjKey.TramBom}`,
    //       items: [
    //         {
    //           label: "Công trình trạm bơm",
    //           link: `${AdminRoutingName.adminUri}/${AdminRoutingName.danhsachtram}/${ObjKey.TramBom}`,
    //         },
    //       ],
    //     },
    //     {
    //       label: "Quan trắc nước dưới đất",
    //       faIcon: "far fa-monitor-heart-rate",
    //       link: `${AdminRoutingName.adminUri}/${AdminRoutingName.quantrac}/${AdminRoutingName.wrUri}/${ObjKey.GiengQuantrac}`,
    //       items: [
    //         {
    //           label: "Trạm quan trắc",
    //           link: `${AdminRoutingName.adminUri}/${AdminRoutingName.danhsachtram}/${ObjKey.TramQuanTracNDD}`,
    //         },
    //         {
    //           label: "Công trình quan trắc",
    //           link: `${AdminRoutingName.adminUri}/${AdminRoutingName.danhsachtram}/${ObjKey.GiengQuantrac}`,
    //         },
    //       ],
    //     },
    //     {
    //       label: "Khai thác nước dưới đất",
    //       faIcon: "far fa-monitor-heart-rate",
    //       link: `${AdminRoutingName.adminUri}/${AdminRoutingName.quantrac}/${AdminRoutingName.wrUri}/${ObjKey.GiengKhaiThac}`,
    //       items: [
    //         {
    //           label: "Công trình khai thác",
    //           link: `${AdminRoutingName.adminUri}/${AdminRoutingName.danhsachtram}/${ObjKey.GiengKhaiThac}`,
    //         },
    //       ],
    //     },
    //     {
    //       label: "Xả thải vào nguồn nước",
    //       faIcon: "far fa-monitor-heart-rate",
    //       link: `${AdminRoutingName.adminUri}/${AdminRoutingName.quantrac}/${AdminRoutingName.wrUri}/${ObjKey.DiemXaThai}`,
    //       items: [
    //         {
    //           label: "Điểm xả thải",
    //           faIcon: "far fa-monitor-heart-rate",
    //           link: `${AdminRoutingName.adminUri}/${AdminRoutingName.danhsachtram}/${ObjKey.DiemXaThai}`,
    //         },
    //       ],
    //     },
    //     {
    //       label: "Công trình khác",
    //       faIcon: "far fa-signal-stream",
    //       items: this.menuCongTrinhKhacTnnuoc,
    //     },
    //   ],
    // },
    // {
    //   label: "MÔI TRƯỜNG BIỂN",
    //   faIcon: "fal fa-ship",
    //   items: [
    //     {
    //       label: "Phao biển",
    //       faIcon: "far fa-broadcast-tower",
    //       link: "/admin/se/phao",
    //     },
    //     {
    //       label: "Rada biển",
    //       faIcon: "far fa-satellite-dish",
    //       link: "/admin/se/rada",
    //     },
    //     {
    //       label: "Trạm môi trường biển",
    //       faIcon: "far fa-vial",
    //       link: "/admin/se/se_en",
    //     },
    //   ],
    // },
    // {
    //   label: "BÁO CÁO",
    //   faIcon: "fal fa-file-chart-pie",
    //   items: [
    //     {
    //       label: "Biểu đồ n3js",
    //       link: AdminRoutingName.chartsUri,
    //       faIcon: "fal fa-chart-line",
    //     },
    //   ],
    // },
    {
      label: "DỮ LIỆU KHÔNG GIAN",
      faIcon: "fal fa-globe",
      items: [
        {
          label: "Lớp bản đồ",
          link:
            "/admin/" +
            AdminRoutingName.mapUri +
            "/" +
            AdminRoutingName.lopbandoUri,
          faIcon: "fal fa-layer-group",
        },
        {
          label: "Nhóm lớp bản đồ",
          link:
            "/admin/" +
            AdminRoutingName.mapUri +
            "/" +
            AdminRoutingName.nhomlopbandoUri,
          faIcon: "fal fa-folders",
        },
        {
          label: "Bản đồ",
          link:
            "/admin/" +
            AdminRoutingName.mapUri +
            "/" +
            AdminRoutingName.bandoUri,
          faIcon: "fal fa-map-marked-alt",
        },
        {
          label: "Nhóm bản đồ",
          link:
            "/admin/" +
            AdminRoutingName.mapUri +
            "/" +
            AdminRoutingName.nhombandoUri,
          faIcon: "fal fa-atlas",
        },
        {
          label: "Hệ tọa độ",
          link:
            "/admin/" +
            AdminRoutingName.mapUri +
            "/" +
            AdminRoutingName.hetoadoUri,
          faIcon: "fal fa-globe-stand",
        },
      ],
    },
    {
      label: "THƯ VIỆN",
      faIcon: "fas fa-photo-video",
      link: "/admin/" + AdminRoutingName.thuvienUri,
    },
    {
      label: "TIN BÀI",
      faIcon: "fal fa-th-list",
      items: [
        {
          label: "Chủ đề",
          link:
            "/admin/" +
            AdminRoutingName.tinbaiUri +
            "/" +
            AdminRoutingName.chuDe,
          faIcon: "fal fa-th",
        },
        {
          label: "Tin tức",
          link:
            "/admin/" +
            AdminRoutingName.tinbaiUri +
            "/" +
            AdminRoutingName.tinTuc,
          faIcon: "fal fa-th",
        },
      ],
    },
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
