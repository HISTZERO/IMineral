import { AdminRoutingName } from "src/app/routes/admin-routes-name";

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
