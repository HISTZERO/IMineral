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
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.thamdokhoangsanUri}`,
  },
  {
    title: "Chi tiết",
    url: "",
  },
];
