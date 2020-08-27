import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuKhuVucDauGia = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Khu vực khoáng sản",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}`,
  },
  {
    title: "Khu vực đấu giá",
    url: "",
  },
];
