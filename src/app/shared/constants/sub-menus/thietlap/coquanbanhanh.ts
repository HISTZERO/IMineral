import { AdminRoutingName } from "src/app/routes/admin-routes-name";

export const MenuCoQuanBanHanh = [
  { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
  {
    title: "Thiết lập",
    url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.thietlapUri}`,
  },
  {
    title: "Cấu hình cơ quan ban hành",
    url: "",
  },
];
