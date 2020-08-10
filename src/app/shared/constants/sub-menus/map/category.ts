import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuListCategory = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Dữ liệu không gian",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.mapUri}`,
  },
  {
    title: "Nhóm bản đồ",
    url: "",
  },
];
