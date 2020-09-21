import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuThamDoKhoangSan = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Thăm dò khoáng sản",
    url: "",
  },
];

export const MenuThamDoKhoangSanChitiet = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Thăm dò khoáng sản",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkthamdokhoangsanUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];

export const ButtonBackThamDoKhoangSan = [
  {
    title: `Thăm dò khoáng sản`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkthamdokhoangsanUri}`
  },
];

export const MenuDkKhaiThacKhoangSan = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Khai thác khoáng sản",
    url: "",
  },
];

export const MenuDkKhaiThacKhoangSanChitiet = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Thăm dò khoáng sản",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkKhaithackhoangsanUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];


export const ButtonBackKhaiThacKhoangSan = [
    {
      title: `Thăm dò khoáng sản`,
      icon: "fad fa-chevron-double-left",
      color: "btn-primary",
      url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkKhaithackhoangsanUri}`
    },
  ];

export const MenuDkPheDuyetTruLuongKhoangSan = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Phê duyệt trữ lượng khoáng sản",
    url: "",
  },
];

export const MenuDkPheDuyetTruLuongKhoangSanChitiet = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Phê duyệt trữ lượng khoáng sản",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkPheDuyetTruLuongUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];

export const ButtonBackPheDuyetTruLuongKhoangSan = [
  {
    title: `Phê duyệt trữ lượng khoáng sản`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkPheDuyetTruLuongUri}`
  },
];

export const MenuDkDauGiaQuyen = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Đấu giá quyền khai thác khoáng sản",
    url: "",
  },
];

export const MenuDkDauGiaQuyenChitiet = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Đấu giá quyền khai thác khoáng sản",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkDauGiaQuyenUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];

export const ButtonBackDauGiaQuyen = [
  {
    title: `Đấu giá quyền khai thác khoáng sản`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkDauGiaQuyenUri}`
  },
];
