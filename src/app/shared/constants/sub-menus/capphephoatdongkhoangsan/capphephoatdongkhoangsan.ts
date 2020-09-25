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
