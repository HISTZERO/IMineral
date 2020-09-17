import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuCoQuanTiepNhan = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Thiết lập",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.thietlapUri}`,
  },
  {
    title: "Cấu hình cơ quan tiếp nhận",
    url: "",
  },
];
