import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuListLayer = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Dữ liệu không gian",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}`,
  },
  {
    title: "Lớp bản đồ",
    url: "",
  },
];
