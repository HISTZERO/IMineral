import { AdminRoutingName } from 'src/app/routes/admin-routes-name';

// Thăm dò khoáng sản
export const MenuCpThamDoKhoangSan = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}`,
  },
  {
    title: "Cấp phép thăm dò khoáng sản",
    url: "",
  },
];

export const MenuCpThamDoKhoangSanChitiet = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}`,
  },
  {
    title: "Cấp phép thăm dò khoáng sản",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}/${AdminRoutingName.cpthamdokhoangsanUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];

export const ButtonBackCpThamDoKhoangSan = [
  {
    title: `Cấp phép thăm dò khoáng sản`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}/${AdminRoutingName.cpthamdokhoangsanUri}`
  },
];


// Khai thác khoáng sản
export const MenuCpKhaiThacKhoangSan = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}`,
  },
  {
    title: "Cấp phép khai thác khoáng sản",
    url: "",
  },
];

export const MenuCpKhaiThacKhoangSanChitiet = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}`,
  },
  {
    title: "Cấp phép khai thác khoáng sản",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}/${AdminRoutingName.cpkhaithackhoangsanUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];

export const ButtonBackCpKhaiThacKhoangSan = [
  {
    title: `Cấp phép khai thác khoáng sản`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}/${AdminRoutingName.cpkhaithackhoangsanUri}`
  },
];

// phê duyệt trữ lượng khoáng sản
export const MenuCpPheDuyetTruLuongKhoangSan = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}`,
  },
  {
    title: "Cấp phép phê duyệt trữ lượng khoáng sản",
    url: "",
  },
];

export const MenuCpPheDuyetTruLuongKhoangSanChitiet = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Đăng ký hoạt động",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}`,
  },
  {
    title: "Cấp phép phê duyệt trữ lượng khoáng sản",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}/${AdminRoutingName.cppheduyettruluongkhoangsanUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];

export const ButtonBackCpPheDuyetTruLuongKhoangSan = [
  {
    title: `Cấp phép phê duyệt trữ lượng khoáng sản`,
    icon: "fad fa-chevron-double-left",
    color: "btn-primary",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.capphephoatdongkhoangsanUri}/${AdminRoutingName.cppheduyettruluongkhoangsanUri}`
  },
];
