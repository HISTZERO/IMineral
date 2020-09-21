import { AdminRoutingName } from "src/app/routes/admin-routes-name";

// Thăm dò khoáng sản
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
    title: `Thăn dò khoáng sản`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkthamdokhoangsanUri}`
  },
];

// Khai thác khoáng sản
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
    title: "Khai thác khoáng sản",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkKhaithackhoangsanUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];


export const ButtonBackKhaiThacKhoangSan = [
  {
    title: `Khai thác khoáng sản`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkKhaithackhoangsanUri}`
  },
];

// Tận thu khoáng sản
export const MenuDkTanThuKhoangSan = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Tận thu khoáng sản",
    url: "",
  },
];

export const MenuDkTanThuKhoangSanChitiet = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Tận thu khoáng sản",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkTanthukhoangsanUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];


export const ButtonBackTanThuKhoangSan = [
  {
    title: `Tận thu khoáng sản`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkTanthukhoangsanUri}`
  },
];

// Trả lại giấy phép
export const MenuDkTraLaiGiayPhep = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Trả lại giấy phép thăm dò, khai thác",
    url: "",
  },
];

export const MenuDkTraLaiGiayPhepChitiet = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Trả lại giấy phép thăm dò, khai thác",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkTralaigiayphepUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];


export const ButtonBackTraLaiGiayPhep = [
  {
    title: `Trả lại giấy phép thăm dò, khai thác`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkTralaigiayphepUri}`
  },
];

// Đóng cửa mỏ
export const MenuDkDongCuaMo = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Đóng cửa mỏ",
    url: "",
  },
];

export const MenuDkDongCuaMoChitiet = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Đóng cửa mỏ",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkDongcuamoUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];


export const ButtonBackDongCuaMo = [
  {
    title: `Đóng cửa mỏ`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkDongcuamoUri}`
  },
];

// Chuyển nhượng quyền thăm dò, khai thác
export const MenuDkChuyenNhuongQuyen = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Chuyển nhượng quyền thăm dò, khai thác",
    url: "",
  },
];

export const MenuDkChuyenNhuongQuyenChitiet = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}`,
  },
  {
    title: "Chuyển nhượng quyền thăm dò, khai thác",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkChuyennhuongquyenUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];


export const ButtonBackChuyenNhuongQuyen = [
  {
    title: `Chuyển nhượng quyền thăm dò, khai thác`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.dkChuyennhuongquyenUri}`
  },
];
