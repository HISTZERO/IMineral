import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuThietLapHeThong = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Thiết lập",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.thietlapUri}`,
  },
  {
    title: "Thiết lập hệ thống",
    url: "",
  },
];
