import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuListMap = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Dữ liệu không gian",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}`,
  },
  {
    title: "Bản đồ",
    url: "",
  },
];

export const MenuListMapDetail = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Dữ liệu không gian",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}`,
  },
  {
    title: "Bản đồ",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}/${AdminRoutingName.bandoUri}`,
  },
  {
    title: "Chi tiết bản đồ",
    url: "",
  },
];
