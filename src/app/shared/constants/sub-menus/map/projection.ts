import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuListProjecttion = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Dữ liệu không gian",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}`,
  },
  {
    title: "Hệ tọa độ",
    url: "",
  },
];
