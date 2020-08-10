import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuListLayerGroup = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Dữ liệu không gian",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}`,
  },
  {
    title: "Nhóm lớp bản đồ",
    url: "",
  },
];

export const MenuListLayerGroupDetail = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Dữ liệu không gian",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}`,
  },
  {
    title: "Nhóm lớp bản đồ",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}/${AdminRoutingName.nhomlopbandoUri}`,
  },
  {
    title: "Chi tiết nhóm lớp bản đồ",
    url: "",
  },
];
